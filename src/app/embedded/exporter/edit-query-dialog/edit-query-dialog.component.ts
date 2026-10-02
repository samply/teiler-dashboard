import {Component, EventEmitter, Inject, OnDestroy, OnInit, Output} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import {buildEmptyQueryBox, DropdownFormat, ExporterQueriesBox, ExportStatus, formatEnumDisplayLabel} from "../exporter.component";
import {Subscription} from "rxjs";
import {ExporterService} from "../../../teiler/exporter.service";
import {ExporterExecutions} from "../../execution/execution.component";
import {MatTableDataSource} from "@angular/material/table";
import {ExecutionService} from "../../../teiler/execution.service";
import {QueryFormCompletedEvent} from "./query-form/query-form.component";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {PageEvent} from "@angular/material/paginator";

export interface EditQueryDialogData {
  target: string;
  element?: ExporterQueriesBox;
  detailsElement?: ExporterQueriesBox;
}

@Component({
  selector: 'samply-edit-query-dialog',
  templateUrl: './edit-query-dialog.component.html',
  styleUrl: './edit-query-dialog.component.css',
  standalone: false
})
export class EditQueryDialogComponent implements OnInit, OnDestroy {
  // Emits the affected query ID after every request that changed data on
  // the backend, so the exporter page behind the dialog can reload.
  @Output() dataChanged = new EventEmitter<string | undefined>();
  private subscriptionGetExecutionList: Subscription | undefined
  private subscriptionGetOutputFormats: Subscription | undefined
  private subscriptionExecuteQuery: Subscription | undefined;
  private subscriptionGetExportStatus: Subscription | undefined;
  private subscriptionFetchLogs: Subscription | undefined;
  private intervall: number | undefined;
  dataSourceExecutions = new MatTableDataSource<ExporterExecutions>();

  element: ExporterQueriesBox | undefined;
  createTabElement: ExporterQueriesBox | undefined;
  showStepper: boolean = true;
  isCreateTabbed: boolean = false;
  isEditTabbed: boolean = false;
  createTabLabel = $localize`Erstellen`;
  editTabLabel = $localize`Bearbeiten`;
  executionTabLabel = $localize`Ausführung`;
  buttonDisabled: boolean = false;
  outputFormats: DropdownFormat[] = [];
  exportUrl = "";
  importTemplate: string = "";
  ExportStatus: typeof ExportStatus = ExportStatus;
  exportStatus: ExportStatus = ExportStatus.EMPTY;
  exportLog: string[] = [];
  selectedOutputFormat: string = "EXCEL";

  constructor(@Inject(MAT_DIALOG_DATA) public data: EditQueryDialogData, private exporterService: ExporterService, private dialogRef: MatDialogRef<EditQueryDialogComponent, boolean>, private executionService: ExecutionService) {
    this.showStepper = data.target !== 'execution';
    this.isCreateTabbed = data.target === 'create' || data.target === 'execution';
    this.isEditTabbed = data.target === 'edit';

    this.element = data.target === 'create' ? (data.detailsElement ?? data.element) : data.element;
    // The "Erstellen" tab always starts a brand new query, never the query
    // being viewed/executed - for 'execution', data.element is that
    // existing query, so build a fresh blank one instead of reusing it.
    this.createTabElement = data.target === 'execution' ? buildEmptyQueryBox(data.element?.contactId ?? '') : data.element;
  }

  ngOnInit(): void {
    this.exportUrl = this.exporterService.getExporterURL() + "/";
    this.getOutputFormats();

    if (this.element) {
      this.element.defaultOutputFormat !== null && this.element.defaultOutputFormat !== undefined ? this.selectedOutputFormat = this.element.defaultOutputFormat : this.selectedOutputFormat = "EXCEL";
      if (this.element.loadedQueryID) this.getQueryExecutions(parseInt(this.element.loadedQueryID))
    }
  }

  ngOnDestroy(): void {
    this.subscriptionGetOutputFormats?.unsubscribe();
    this.subscriptionExecuteQuery?.unsubscribe();
    this.subscriptionGetExportStatus?.unsubscribe();
    this.subscriptionFetchLogs?.unsubscribe();
    this.subscriptionGetExecutionList?.unsubscribe();
    window.clearInterval(this.intervall);
  }

  getOutputFormats(): void {
    this.subscriptionGetOutputFormats?.unsubscribe();
    this.subscriptionGetOutputFormats = this.exporterService.getOutputFormats().subscribe({
      next: (formatList: string[]) => {
        formatList.forEach((format) => {
          this.outputFormats.push({value: format, display: formatEnumDisplayLabel(format)})
        })
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  onTabChanged(event: MatTabChangeEvent): void {
    // Keep showStepper in sync with whichever tab is actually active,
    // including manual tab-header clicks, so a later programmatic
    // `showStepper = true` (e.g. from editFromExecutionView) is a real
    // state change that Angular pushes through to the tab group instead
    // of a no-op because the variable never noticed the manual switch.
    this.showStepper = event.tab.textLabel === this.createTabLabel || event.tab.textLabel === this.editTabLabel;
    if (event.tab.textLabel === this.executionTabLabel && this.element?.loadedQueryID) {
      this.getQueryExecutions(parseInt(this.element.loadedQueryID));
    }
  }

  editFromExecutionView(): void {
    // "Anfrage bearbeiten" should open the edit view for the query shown
    // here, not the "Erstellen" tab (which is for creating a brand new,
    // unrelated query). Drop out of tabbed mode entirely so the plain
    // edit form for `element` (the query being viewed) is shown, the same
    // way it already works when this dialog is opened directly in edit
    // mode. In edit-tabbed mode the "Bearbeiten" tab already holds that
    // query, so just switch back to it.
    if (!this.isEditTabbed) {
      this.isCreateTabbed = false;
    }
    this.showStepper = true;
  }

  transformDate(date: string): string {
    return new Date(date).getTime().toString();
  }

  onFormCompleted(result: QueryFormCompletedEvent): void {
    this.element = result.element;
    this.createTabElement = result.element;
    this.importTemplate = result.importTemplate;
    this.selectedOutputFormat = result.element.selectedOutputFormat;
    this.dataChanged.emit(result.element.loadedQueryID);
    if (!result.execute) {
      return;
    }
    if (!this.isEditTabbed) {
      this.isCreateTabbed = true;
    }
    this.showStepper = false;
    this.executeQuery();
  }

  executeQuery(): void {
    if (!this.element?.loadedQueryID) {
      return;
    }
    this.buttonDisabled = true;
    this.subscriptionExecuteQuery?.unsubscribe();
    this.subscriptionExecuteQuery = this.exporterService.executeQuery(this.element.loadedQueryID, this.selectedOutputFormat, this.element.selectedTemplate, this.importTemplate).subscribe({
      next: (response) => {
        const url = new URL(response.responseUrl)
        const id = url.searchParams.get("query-execution-id");
        this.dataChanged.emit(this.element?.loadedQueryID);
        if (id) {
          this.pollingStatusAndLogs(id);
        }
      },
      error: (error) => {
        console.log(error);
        this.buttonDisabled = false;
      },
      complete: () => {
      }
    });
  }

  pollingStatusAndLogs(id: string): void {
    this.subscriptionGetExportStatus?.unsubscribe();
    this.subscriptionFetchLogs?.unsubscribe();
    window.clearInterval(this.intervall);
    setTimeout(() => {
      if (this.element?.loadedQueryID) this.getQueryExecutions(parseInt(this.element.loadedQueryID))
    }, 1000);
    this.exportStatus = ExportStatus.RUNNING;
    const exportDiv = document.getElementById("exportDiv");
    this.intervall = window.setInterval(() => {
      this.subscriptionGetExportStatus = this.exporterService.getExportStatus(id).subscribe({
        next: (status) => {
          this.exportStatus = status;
          if (status !== ExportStatus.RUNNING) {
            window.clearInterval(this.intervall);
            this.buttonDisabled = false;
            this.dataChanged.emit(this.element?.loadedQueryID);
            if (status === ExportStatus.OK) {
              this.exportLog = [];
              if (this.selectedOutputFormat !== 'OPAL') {this.downloadExport(id)}
              setTimeout(() => {
                if (this.element?.loadedQueryID) this.getQueryExecutions(parseInt(this.element.loadedQueryID))
              }, 2000);
            }
          }
        },
        error: (error) => {
          console.log(error);
        }
      });
      if (this.exportStatus === ExportStatus.RUNNING) {
        this.subscriptionFetchLogs = this.exporterService.fetchLogs(1000).subscribe({
          next: (response) => {
            this.exportLog = response;
            this.scrollToEndOfLog(exportDiv);
          },
          error: (error) => {
            console.log(error);
          }
        });
      }
    }, 2000);
  }

  scrollToEndOfLog(element: HTMLElement | null): void {
    if (element) {
      const isScrolledToBottomReport = element.scrollHeight - element.clientHeight <= element.scrollTop + 1;
      setTimeout(function () {
        if (isScrolledToBottomReport) {
          element.scrollTop = element.scrollHeight - element.clientHeight;
        }
      }, 200);
    }
  }

  downloadExport(id: string): void {
    window.location.href = this.exportUrl + 'response?query-execution-id=' + id;
  }

  deleteQuery() {
    this.dialogRef.close(false)
  }

  readonly executionPaginatorThreshold = 5;
  executionPageIndex: number = 0;
  executionPageSize: number = 5;

  get pagedExecutions(): ExporterExecutions[] {
    const start = this.executionPageIndex * this.executionPageSize;
    return this.dataSourceExecutions.data.slice(start, start + this.executionPageSize);
  }

  onExecutionPage(event: PageEvent): void {
    this.executionPageIndex = event.pageIndex;
    this.executionPageSize = event.pageSize;
  }

  getQueryExecutions(queryID: number): void {
    this.executionPageIndex = 0;
    this.subscriptionGetExecutionList?.unsubscribe();
    this.subscriptionGetExecutionList = this.executionService.getExecutionList(queryID).subscribe({
      next: (execs) => {
        const tempExecs: ExporterExecutions[] = [];
        execs.forEach((execution) => {
          if (execution.queryId == queryID) {
            tempExecs.push({
              id: execution.id,
              queryId: execution.queryId,
              templateId: execution.templateId,
              outputFormat: execution.outputFormat,
              status: execution.status,
              executedAt: this.transformDate(execution.executedAt)
            })
            tempExecs.sort((a, b) => Number(b.executedAt) - Number(a.executedAt))
            this.dataSourceExecutions.data = tempExecs;
            this.dataSourceExecutions._updateChangeSubscription();
          }
        })
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
      }
    })
  }
}
