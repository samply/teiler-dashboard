import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {ExporterService, exportLog} from "../../teiler/exporter.service";
import {from, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {EmbeddedTeilerApps} from "../../teiler/teiler-app";
import {QBResponse, Templates} from "../quality-report/quality-report.component";
import {environment} from "../../../environments/environment";
import {SelectionModel} from "@angular/cdk/collections";
import {TeilerAuthService} from "../../security/teiler-auth.service";
import {createRouterLinkForBase} from "../../route/route-utils";

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
@Component({
  selector: 'exporter',
  templateUrl: './exporter.component.html',
  styleUrls: ['./exporter.component.css']
})
export class ExporterComponent implements OnInit, OnDestroy {

  private subscriptionGetQueries: Subscription | undefined
  private subscriptionGetTemplateIDs: Subscription | undefined
  private subscriptionGetOutputFormats: Subscription | undefined
  private subscriptionGetQueryFormats: Subscription | undefined
  private subscriptionGenerateExport: Subscription | undefined
  private subscriptionGetExportStatus: Subscription | undefined
  private subscriptionFetchLogs: Subscription | undefined
  private subscriptionUpdateQuery: Subscription | undefined
  private subscriptionCreateQuery: Subscription | undefined;
  displayedColumns: string[] = ['#', 'timestamp', 'querytitle', 'querysource', 'format', 'executions'];
  dataSource = new MatTableDataSource<ExporterQueries>();
  clickedRows = new Set<ExporterQueries>();
  buttonDisabled: boolean = true;
  editButtonDisabled: boolean = true;
  editModus: boolean = false;
  exportLog: exportLog[] = [];
  templateIDs: Templates[] = [];
  outputFormats: DropdownFormat[] = [];
  queryFormats: DropdownFormat[] = [];
  selectedTemplate: string = environment.config.EXPORTER_DEFAULT_TEMPLATE_ID;
  selectedOutputFormat: string = "JSON";
  selectedQueryFormat: string = "FHIR_SEARCH";
  exportUrl = "";
  fileName: string | undefined;
  importTemplate: string = "";
  ExportStatus: typeof ExportStatus = ExportStatus;
  exportStatus: ExportStatus = ExportStatus.EMPTY;
  private intervall: number | undefined;
  expirationDate: Date | undefined;
  query: string = "";
  queryLabel: string = "";
  queryDescription: string = "";
  contactID: string | undefined;
  selection = new SelectionModel<any>(false, []);
  executeOnSaving: boolean = true;
  saveButtonText: Map<boolean, string> = new Map([[false, "Anfrage speichern"], [true, "Anfrage speichern und ausführen"]]);
  loadedQueryID: string = "";
  activeQueries: boolean = true;
  archivedQueries: boolean = true;
  queryList:ExporterQueries[] = [];
  executionLink: string = EmbeddedTeilerApps.EXECUTION;
  panelOpenState: boolean = false;
  contextArray: Context[] = [{key: "", value: ""}];

  constructor(private exporterService: ExporterService, private router: Router, public authService: TeilerAuthService) {
    from(authService.loadUserProfile()).subscribe(keycloakProfile => this.contactID = keycloakProfile.email);
  }
  // @ts-ignore
  @ViewChild('paginator') paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    this.exportUrl = this.exporterService.getExporterURL() + "/";
    this.getQueries();
    this.getTemplateIDs();
    this.getOutputFormats();
    this.getQueryFormats();
  }

  ngOnDestroy(): void {
    this.subscriptionGetQueries?.unsubscribe();
    this.subscriptionGetTemplateIDs?.unsubscribe();
    this.subscriptionGetOutputFormats?.unsubscribe();
    this.subscriptionGetQueryFormats?.unsubscribe();
    this.subscriptionGenerateExport?.unsubscribe();
    this.subscriptionGetExportStatus?.unsubscribe();
    this.subscriptionFetchLogs?.unsubscribe();
    this.subscriptionUpdateQuery?.unsubscribe();
    this.subscriptionCreateQuery?.unsubscribe();
    window.clearInterval(this.intervall);
  }

  getQueries(): void {
    this.subscriptionGetQueries?.unsubscribe();
    this.subscriptionGetQueries = this.exporterService.getReports().subscribe({
      next: (queryList:ExporterQueries[]) => {
        this.queryList = queryList;
        this.filterQueries();
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {}
    })
  }

  filterQueries(): void {
    const tempEQs: ExporterQueries[] = [];
    this.queryList.forEach((query) => {
      if ((this.activeQueries && query.archivedAt === null) || (this.archivedQueries && query.archivedAt !== null)) {
        tempEQs.push({
          id: query.id,
          query: query.query,
          format: query.format,
          label: query.label,
          description: query.description,
          contactId: query.contactId,
          expirationDate: this.transformDate(query.expirationDate),
          createdAt: this.transformDate(query.createdAt),
          archivedAt: this.transformDate(query.archivedAt)
        });
      }
    })
    tempEQs.sort((a,b) =>  Number(b.createdAt) - Number(a.createdAt))
    this.dataSource.data = tempEQs;
    this.dataSource._updateChangeSubscription();
  }

  openQuery(query:ExporterQueries): void {
    console.log(query)
//    this.router.navigate([EmbeddedTeilerApps.EXECUTION, query.id], {state: { query: query.query, label: query.label, description: query.description, selectedQueryFormat: query.format, selectedOutputFormat: "", selectedTemplate: ""}})
  }
  transformDate(date: string): string {
    return new Date(date).getTime().toString();
  }

  createAndExecuteQuery() {
    this.subscriptionGenerateExport?.unsubscribe();
    this.subscriptionGenerateExport = this.exporterService.generateExport(this.query, this.queryLabel, this.queryDescription, this.selectedQueryFormat, this.selectedOutputFormat, this.selectedTemplate, this.getContext(), this.importTemplate).subscribe({
      next: (response: QBResponse) => {
        const url = new URL(response.responseUrl)
        const id = url.searchParams.get("query-execution-id");
        //this.exportStatus = ExportStatus.RUNNING
        if (id) {
          this.router.navigate([this.executionLink, id], {
            state: {
              newQueryID: id,
              query: this.query,
              label: this.queryLabel,
              description: this.queryDescription,
              selectedQueryFormat: this.selectedQueryFormat,
              selectedOutputFormat: this.selectedOutputFormat,
              selectedTemplate: this.selectedTemplate
            }
          })
          //this.pollingStatusAndLogs(id, false);
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {}
    });
  }
  executeQuery() {
    this.subscriptionGenerateExport?.unsubscribe();
    this.subscriptionGenerateExport = this.exporterService.executeQuery(this.loadedQueryID, this.selectedOutputFormat, this.selectedTemplate, this.importTemplate).subscribe({
      next: (response: QBResponse) => {
        const url = new URL(response.responseUrl)
        const id = url.searchParams.get("query-execution-id");
        //this.exportStatus = ExportStatus.RUNNING
        if (id) {
          this.router.navigate([this.executionLink, this.loadedQueryID], {
            state: {
              newExecID: id,
              query: this.query,
              label: this.queryLabel,
              description: this.queryDescription,
              selectedQueryFormat: this.selectedQueryFormat,
              selectedOutputFormat: this.selectedOutputFormat,
              selectedTemplate: this.selectedTemplate
            }
          })
          //this.pollingStatusAndLogs(id, false);
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {}
    });
  }
  saveQuery() {
    this.subscriptionUpdateQuery?.unsubscribe();
    this.subscriptionCreateQuery?.unsubscribe();

    this.buttonDisabled = true;

    if (this.executeOnSaving) {
      this.createAndExecuteQuery();
    } else {
      if (this.loadedQueryID !== "") {
        this.subscriptionUpdateQuery = this.exporterService.updateQuery(this.loadedQueryID, this.queryLabel, this.queryDescription).subscribe({
          next: (response: any) => {
            this.getQueries();
            this.editModus = false;
            this.buttonDisabled = false;
          },
          error: (error) => {
            console.log(error);
            this.editModus = false;
            this.buttonDisabled = false;
          },
          complete: () => {}
        });
      } else {
        this.subscriptionCreateQuery = this.exporterService.createQuery(this.query, this.queryLabel, this.queryDescription, this.selectedQueryFormat, this.selectedOutputFormat, this.contactID, this.selectedTemplate, this.getContext(), this.importTemplate).subscribe({
          next: (response: QueryResponse) => {
            this.getQueries();
            this.editModus = false;
            this.buttonDisabled = false;
          },
          error: (error) => {
            console.log(error);
            this.editModus = false;
            this.buttonDisabled = false;
          },
          complete: () => {}
        });
      }
    }
  }

  getTemplateIDs(): void {
    this.subscriptionGetTemplateIDs?.unsubscribe();
    this.subscriptionGetTemplateIDs = this.exporterService.getExporterTemplates().subscribe({
      next: (templateList:string[]) => {
        templateList.forEach((template) => {
          this.templateIDs.push({value: template, display: template})
        })
        this.templateIDs.push({value: "custom", display:"Eigenes Template"})
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
  getOutputFormats(): void {
    this.subscriptionGetOutputFormats?.unsubscribe();
    this.subscriptionGetOutputFormats = this.exporterService.getOutputFormats().subscribe({
      next: (formatList:string[]) => {
        formatList.forEach((format) => {
          this.outputFormats.push({value: format, display: format.toLowerCase()})
        })
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
  getQueryFormats(): void {
    this.subscriptionGetQueryFormats?.unsubscribe();
    this.subscriptionGetQueryFormats = this.exporterService.getQueryFormats().subscribe({
      next: (formatList:string[]) => {
        formatList.forEach((format) => {
          this.queryFormats.push({value: format, display: format.toLowerCase()})
        })
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
  doImportFromFile(event: Event): void {
    // @ts-ignore
    const file: File = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = this.onReaderLoad.bind(this);
    reader.readAsText(file);
    this.fileName = file.name;
  }
  onReaderLoad(event: any): void {
    this.importTemplate = event.target.result;
    //this.generateExport();
  }

  cancelExport(): void {
    window.clearInterval(this.intervall);
    this.buttonDisabled = false;
    this.exportStatus = ExportStatus.EMPTY;
  }
  generateButtonStatus(): void {
    this.buttonDisabled = (this.queryLabel === "")  || (this.query === "") || (this.queryDescription === "");
  }
  downloadTemplate(): void {
    window.location.href = this.exportUrl + 'template?template-id=' + this.selectedTemplate;
  }

  toggleCheckbox(event: any, row: any): void {
    if (!this.editModus) {
      event ? this.selection.toggle(row) : null;
      this.loadQuery();
    }
  }
  loadQuery(): void {
    const query: ExporterQueries[] = this.selection.selected
    if(query.length > 0) {
      this.query = query[0].query;
      this.queryDescription = query[0].description;
      this.queryLabel = query[0].label;
      this.selectedQueryFormat = query[0].format;
      this.contactID = query[0].contactId;
      this.editButtonDisabled = false;
      this.executeOnSaving = true;
      this.buttonDisabled = false;
      this.loadedQueryID = query[0].id.toString();
      this.panelOpenState = true;
    }
    else {
      this.query = "";
      this.queryDescription = "";
      this.queryLabel = "";
      from(this.authService.loadUserProfile()).subscribe(keycloakProfile => this.contactID = keycloakProfile.email);
      this.selectedQueryFormat = "FHIR_SEARCH";
      this.editButtonDisabled = true;
      this.buttonDisabled = true;
      this.loadedQueryID = "";
    }
  }

  createNewQuery(): void {
    this.editModus = true;
    this.queryLabel = "";
    this.queryDescription = "";
    this.query = "";
    from(this.authService.loadUserProfile()).subscribe(keycloakProfile => this.contactID = keycloakProfile.email);
    this.selectedTemplate = environment.config.EXPORTER_DEFAULT_TEMPLATE_ID;
    this.selectedOutputFormat = "JSON";
    this.selectedQueryFormat = "FHIR_SEARCH";
    this.expirationDate = undefined;
    this.loadedQueryID = "";
    this.panelOpenState = true;
    this.generateButtonStatus();
  }

  editQuery(): void {
    this.editModus = true;
    this.panelOpenState = true;
    this.generateButtonStatus();
  }
  saveButtonMenu(modus: boolean) {
    this.executeOnSaving = modus;
  }
  cancelEdit(): void {
    this.editModus = false;
  }
  getRouterLink(id: string): string {
    return '/' + createRouterLinkForBase(this.executionLink + '/' + id);
  }
  addContextInput(): void {
    this.contextArray.push({key: "", value: ""} as Context)
  }
  deleteContextInput(index: number): void {
    this.contextArray.splice(index, 1)
  }
  getContext(): string {
    let context: string = "";
    this.contextArray.forEach(contextPair => {
      if (contextPair.key.length !== 0 && contextPair.value.length !== 0) {
        if (context.length !== 0) {
          context += ";"
        }
        context += contextPair.key + "=" + contextPair.value;
      }
    })
    //return Buffer.from(context).toString("base64");
    return btoa(context);
  }
}
