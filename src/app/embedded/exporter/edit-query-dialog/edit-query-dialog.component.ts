import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import {DropdownFormat, ExporterQueriesBox, formatEnumDisplayLabel} from "../exporter.component";
import {Subscription} from "rxjs";
import {ExporterService} from "../../../teiler/exporter.service";
import {ExporterExecutions} from "../../execution/execution.component";
import {MatTableDataSource} from "@angular/material/table";
import {ExecutionService} from "../../../teiler/execution.service";
import {QueryFormCompletedEvent} from "./query-form/query-form.component";

export enum ExportStatus {
  OK = "OK",
  RUNNING = "RUNNING",
  NOT_FOUND = "NOT_FOUND",
  EMPTY = "EMPTY",
  ERROR = "ERROR"
}

export interface EditQueryDialogData {
  target: string;
  element?: ExporterQueriesBox;
  createElement?: ExporterQueriesBox;
  editElement?: ExporterQueriesBox;
}

@Component({
  selector: 'samply-edit-query-dialog',
  templateUrl: './edit-query-dialog.component.html',
  styleUrl: './edit-query-dialog.component.css',
  standalone: false
})
export class EditQueryDialogComponent implements OnInit, OnDestroy {
  private subscriptionGetExecutionList: Subscription | undefined
  private subscriptionGetOutputFormats: Subscription | undefined
  private subscriptionExecuteQuery: Subscription | undefined;
  private subscriptionGetExportStatus: Subscription | undefined;
  private subscriptionFetchLogs: Subscription | undefined;
  private intervall: number | undefined;
  dataSourceExecutions = new MatTableDataSource<ExporterExecutions>();

  element: ExporterQueriesBox | undefined;
  createElement: ExporterQueriesBox | undefined;
  editElement: ExporterQueriesBox | undefined;
  showStepper: boolean = true;
  isTabbedForm: boolean = false;
  createTabLabel = $localize`Erstellen`;
  editTabLabel = $localize`Bearbeiten`;
  buttonDisabled: boolean = false;
  outputFormats: DropdownFormat[] = [];
  exportUrl = "";
  importTemplate: string = "";
  ExportStatus: typeof ExportStatus = ExportStatus;
  exportStatus: ExportStatus = ExportStatus.EMPTY;
  exportLog: string[] = [];
  selectedOutputFormat: string = "EXCEL";

  constructor(@Inject(MAT_DIALOG_DATA) public data: EditQueryDialogData, private exporterService: ExporterService, private dialogRef: MatDialogRef<EditQueryDialogComponent, boolean>, private executionService: ExecutionService) {
    if (data.target === 'formular') {
      this.createElement = data.createElement;
      this.editElement = data.editElement;
      this.isTabbedForm = true;
      this.showStepper = true;
    } else {
      this.element = data.element;
      this.showStepper = false;
    }
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

  transformDate(date: string): string {
    return new Date(date).getTime().toString();
  }

  onFormCompleted(result: QueryFormCompletedEvent): void {
    if (!result.execute) {
      this.dialogRef.close(true);
      return;
    }
    this.element = result.element;
    this.importTemplate = result.importTemplate;
    this.selectedOutputFormat = result.element.selectedOutputFormat;
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

  getQueryExecutions(queryID: number): void {
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
