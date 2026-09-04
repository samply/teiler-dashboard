import {Component, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {ExporterService} from "../../teiler/exporter.service";
import {from, Subscription} from "rxjs";
import {TeilerAuthService} from "../../security/teiler-auth.service";
import {ViewportScroller} from "@angular/common";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {EditQueryDialogComponent} from "./edit-query-dialog/edit-query-dialog.component";
import {ExporterExecutions} from "../execution/execution.component";
import {ExecutionService} from "../../teiler/execution.service";
import {environment} from "../../../environments/environment";

const KNOWN_FORMAT_ACRONYMS = ['FHIR', 'CQL', 'CSV', 'JSON', 'XML', 'SQL', 'ID', 'URL'];

export function formatEnumDisplayLabel(value: string): string {
  return value
    .split('_')
    .map((word) => {
      const upper = word.toUpperCase();
      if (KNOWN_FORMAT_ACRONYMS.includes(upper)) {
        return upper;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

export interface ExporterQueries {
  id: number;
  query: string;
  format: string;
  label: string;
  description: string;
  contactId: string;
  expirationDate: string;
  createdAt: string;
  archivedAt: string;
  context: string;
  defaultTemplateId: string;
  defaultOutputFormat: string;
}
export interface ExporterQueriesBox extends ExporterQueries {
  selectedQueryFormat: string;
  selectedOutputFormat: string;
  selectedTemplate: string
  contextArray: Context[];
  loadedQueryID?: string;
}
export interface ExportResponse {
  responseUrl: URL;
}
export interface QueryResponse {
  queryId: string;
}
export interface DropdownFormat {
  value: string;
  display: string
}
export enum ExportStatus {
  OK = "OK",
  RUNNING = "RUNNING",
  NOT_FOUND = "NOT_FOUND",
  EMPTY = "EMPTY",
  ERROR = "ERROR"
}
export interface Context {
  key: string;
  value: string;
}
export interface QueryBoxRow {
  key: string;
  feld: string;
  wert: string;
  isDate?: boolean;
}
@Component({
    selector: 'exporter',
    templateUrl: './exporter.component.html',
    styleUrls: ['./exporter.component.css'],
    standalone: false
})
export class ExporterComponent implements OnInit, OnDestroy {
  private subscriptionGetExecutionList: Subscription | undefined
  private subscriptionGetQueries: Subscription | undefined
  dataSourceExecutions = new MatTableDataSource<ExporterExecutions>();

  activeDataSource: number = 0;

  queryBoxColumns: string[] = ['feld', 'wert'];
  infoBoxColumns: string[] = ['label', 'createdAt'];
  dataSource = new MatTableDataSource<ExporterQueriesBox>();
  queryFilter: string = '';
  queryList: ExporterQueries[] = [];
  tempEQs: ExporterQueriesBox[] = [];
  readonly dialog = inject(MatDialog);

  constructor(private exporterService: ExporterService, public authService: TeilerAuthService, private viewport: ViewportScroller, private executionService: ExecutionService) {
    this.dataSource.filterPredicate = (data: ExporterQueriesBox, filter: string): boolean => {
      const term = filter.trim().toLowerCase();
      if (!term) {
        return true;
      }
      return [data.label, data.description, data.query, data.contactId, data.format]
        .some((value) => !!value && value.toLowerCase().includes(term));
    };
  }

  applyQueryFilter(): void {
    this.dataSource.filter = this.queryFilter;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // @ts-ignore
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('queryBox') queryBoxRef: ElementRef<HTMLDivElement> | undefined;
  @ViewChild('infoBox') infoBoxRef: ElementRef<HTMLDivElement> | undefined;
  private queryBoxResizeObserver: ResizeObserver | undefined;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.viewport.scrollToPosition([0, 0]);

    if (this.queryBoxRef && this.infoBoxRef) {
      const queryBoxElement = this.queryBoxRef.nativeElement;
      const infoBoxElement = this.infoBoxRef.nativeElement;
      // box-sizing is border-box (Bootstrap reset), so use the border-box
      // height here too - ResizeObserver's contentRect always excludes padding.
      this.queryBoxResizeObserver = new ResizeObserver(() => {
        infoBoxElement.style.height = `${queryBoxElement.getBoundingClientRect().height}px`;
      });
      this.queryBoxResizeObserver.observe(queryBoxElement);
    }
  }

  ngOnInit(): void {
    this.getQueries();
    window.dispatchEvent(new Event('resize'));
  }

  ngOnDestroy(): void {
    this.subscriptionGetQueries?.unsubscribe();
    this.subscriptionGetExecutionList?.unsubscribe();
    this.queryBoxResizeObserver?.disconnect();
  }

  getQueries(): void {
    this.subscriptionGetQueries?.unsubscribe();
    this.subscriptionGetQueries = this.exporterService.getReports().subscribe({
      next: (queryList: ExporterQueries[]) => {
        this.queryList = queryList;
        this.filterQueries();
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  filterQueries(): void {
    this.tempEQs = this.queryList.map((query) => {
      let selectedOutputFormat: string
      let selectedTemplate: string
      let contextArray: Context[]
      query.defaultOutputFormat !== null && query.defaultOutputFormat !== undefined ? selectedOutputFormat = query.defaultOutputFormat : selectedOutputFormat = "EXCEL";
      query.defaultTemplateId !== null && query.defaultTemplateId !== undefined ? selectedTemplate = query.defaultTemplateId : selectedTemplate = environment.config.EXPORTER_DEFAULT_TEMPLATE_ID;
      if (query.context !== null) {
        contextArray = [];
        atob(query.context).split(';').forEach((context) => {
          const contextPair = context.split('=');
          contextArray.push({key: contextPair[0], value: contextPair[1]} as Context);
        })
      } else {
        contextArray = [{key: "", value: ""} as Context];
      }

      return {
        id: query.id,
        query: query.query,
        format: query.format,
        label: query.label,
        description: query.description,
        contactId: query.contactId,
        expirationDate: this.transformDate(query.expirationDate),
        createdAt: this.transformDate(query.createdAt),
        archivedAt: this.transformDate(query.archivedAt),
        defaultTemplateId: query.defaultTemplateId,
        defaultOutputFormat: query.defaultOutputFormat,
        context: query.context,
        selectedOutputFormat: selectedOutputFormat,
        selectedTemplate: selectedTemplate,
        selectedQueryFormat: query.format,
        contextArray: contextArray
      };
    });
    this.tempEQs.sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
    this.dataSource.data = this.tempEQs;
    this.dataSource._updateChangeSubscription();
  }

  transformDate(date: string): string {
    return new Date(date).getTime().toString();
  }

  executeQuery() {
    const element = this.dataSource.data[this.activeDataSource]
    element.loadedQueryID = element.id.toString();
    this.editDialog(element, "execution")
  }

  openQueryFormDialog(): void {
    from(this.authService.loadUserProfile()).subscribe(keycloakProfile => {
      const contactId = keycloakProfile.email;
      const createElement = this.buildQueryBox(true, contactId);
      const editElement = this.dataSource.data.length > 0 ? this.buildQueryBox(false, contactId) : undefined;

      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.data = {createElement: createElement, editElement: editElement, target: "formular"};
      dialogConfig.width = "1500px";
      this.dialog.open(EditQueryDialogComponent, dialogConfig).afterClosed().subscribe((isSaved: boolean) => {
        if (isSaved) {
          this.getQueries()
        }
      });
    });
  }

  private buildQueryBox(isCreate: boolean, contactId: string): ExporterQueriesBox {
    if (isCreate) {
      return {
        id: this.tempEQs.length,
        label: "",
        description: "",
        query: "",
        contactId: contactId,
        selectedTemplate: environment.config.EXPORTER_DEFAULT_TEMPLATE_ID,
        selectedOutputFormat: "EXCEL",
        selectedQueryFormat: "FHIR_SEARCH",
        expirationDate: "",
        contextArray: [{key: "", value: ""} as Context],
        format: "",
        createdAt: "",
        archivedAt: "",
        context: "",
        defaultTemplateId: "",
        defaultOutputFormat: "",
      };
    }

    const current = this.dataSource.data[this.activeDataSource] ?? this.dataSource.data[0];
    let contextArray: Context[];
    if (current.context) {
      contextArray = [];
      atob(current.context).split(';').forEach((context) => {
        const contextPair = context.split('=');
        contextArray.push({key: contextPair[0], value: contextPair[1]} as Context);
      })
    } else {
      contextArray = [{key: "", value: ""} as Context];
    }
    return {
      loadedQueryID: current.id.toString(),
      id: current.id,
      label: current.label,
      description: current.description,
      query: current.query,
      contactId: current.contactId,
      selectedTemplate: current.selectedTemplate,
      selectedOutputFormat: current.selectedOutputFormat,
      selectedQueryFormat: current.selectedQueryFormat,
      expirationDate: current.expirationDate,
      contextArray: contextArray,
      format: current.format,
      createdAt: current.createdAt,
      archivedAt: current.archivedAt,
      context: current.context,
      defaultTemplateId: current.defaultTemplateId,
      defaultOutputFormat: current.defaultOutputFormat,
    };
  }

  editDialog(element: ExporterQueriesBox, target:string): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {element: element,target: target};
    dialogConfig.width = "1500px";
    this.dialog.open(EditQueryDialogComponent, dialogConfig).afterClosed().subscribe((isSaved:boolean)=>{
      if(isSaved){
        this.getQueries()
      }
    });
  }

  selectQuery(row: ExporterQueriesBox): void {
    this.setActiveDataSource(this.dataSource.data.indexOf(row));
  }

  setActiveDataSource(index: number): void {
    this.activeDataSource = index
    const id = this.dataSource.data[index].id
    this.getQueryExecutions(id)
  }

  getQueryExecutions(queryID: number): void {
    this.dataSourceExecutions.data = []
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
      }
    })
  }

  get currentItem(): any {
    return this.dataSource.data[this.activeDataSource]
  }

  get queryBoxRows(): QueryBoxRow[] {
    const item = this.currentItem;
    if (!item) {
      return [];
    }
    return [
      {key: 'label', feld: $localize`Titel`, wert: item.label},
      {key: 'query', feld: $localize`Abfrage`, wert: item.query},
      {key: 'description', feld: $localize`Beschreibung`, wert: item.description},
      {key: 'defaultTemplateId', feld: $localize`Template`, wert: item.defaultTemplateId},
      {key: 'defaultOutputFormat', feld: $localize`Ausgabeformat`, wert: item.defaultOutputFormat},
      {key: 'expirationDate', feld: $localize`Ablaufdatum`, wert: item.expirationDate, isDate: true},
      {key: 'context', feld: $localize`Umgebungsvariablen`, wert: item.context},
      {key: 'createdAt', feld: $localize`Erstellt am`, wert: item.createdAt, isDate: true},
      {key: 'contactId', feld: $localize`Anfragende/r`, wert: item.contactId},
      {key: 'format', feld: $localize`Format`, wert: item.format},
    ];
  }
}
