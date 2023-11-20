import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {ExporterService, exportLog} from "../../teiler/exporter.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {EmbeddedTeilerApps} from "../../teiler/teiler-app";
import {QBResponse, Templates} from "../quality-report/quality-report.component";
import {environment} from "../../../environments/environment";

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
  displayedColumns: string[] = ['timestamp', 'querysource', 'format'];
  dataSource = new MatTableDataSource<ExporterQueries>();
  clickedRows = new Set<ExporterQueries>();
  buttonDisabled: boolean = true;
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

  constructor(private exporterService: ExporterService, private router: Router) {
  }
  // @ts-ignore
  @ViewChild('paginator') paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    this.exportUrl = this.exporterService.getExporterURL() + "/";
    this.getReports();
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
    window.clearInterval(this.intervall);
  }

  getReports(): void {
    this.subscriptionGetQueries?.unsubscribe();
    this.subscriptionGetQueries = this.exporterService.getReports().subscribe({
      next: (queryList:ExporterQueries[]) => {
        console.log(queryList)
        const tempEQs: ExporterQueries[] = [];
        queryList.forEach((query) => {
          tempEQs.push({id: query.id, query: query.query, format: query.format, label: query.label, description: query.description, contactId: query.contactId, expirationDate: query.expirationDate, createdAt: this.transformDate(query.createdAt), archivedAt: query.archivedAt})
        })
        tempEQs.sort((a,b) =>  Number(b.createdAt) - Number(a.createdAt))
        this.dataSource.data = tempEQs;
        this.dataSource._updateChangeSubscription();
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {}
    })
  }

  openQuery(query:ExporterQueries): void {
    console.log(query)
    this.router.navigate([EmbeddedTeilerApps.EXECUTION, query.id])
  }
  transformDate(date: string): string {
    return new Date(date).getTime().toString();
  }

  generateExport() {
    this.buttonDisabled = true;
    this.subscriptionGenerateExport = this.exporterService.generateExport(this.query, this.queryLabel, this.queryDescription, this.selectedQueryFormat, this.selectedOutputFormat, this.selectedTemplate, this.importTemplate).subscribe({
      next: (response:QBResponse) => {
        const url = new URL(response.responseUrl)
        const id = url.searchParams.get("query-execution-id");
        //this.exportStatus = ExportStatus.RUNNING
        if (id) {
          this.router.navigate([EmbeddedTeilerApps.EXECUTION, id], {state: { newQueryID: id}})
          //this.pollingStatusAndLogs(id, false);
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {}
    });
  }

  pollingStatusAndLogs(id: string, init: boolean): void {
    this.subscriptionGenerateExport?.unsubscribe();
    this.subscriptionGetExportStatus?.unsubscribe();
    this.subscriptionFetchLogs?.unsubscribe();

    const exportDiv = document.getElementById("exportDiv");
    this.intervall = window.setInterval(() => {
      this.subscriptionGetExportStatus = this.exporterService.getExportStatus(id).subscribe({
        next: (status) => {
          console.log(status)
          if (!init || status !== ExportStatus.OK) {this.exportStatus = status;}
          if (status !== ExportStatus.RUNNING) {
            window.clearInterval(this.intervall);
            this.buttonDisabled = false;
            if (status === ExportStatus.OK && !init) {
              this.exportLog = [];
              //this.downloadReport(id);
              this.getReports();
            }
          }
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {}
      });
      if (this.exportStatus === ExportStatus.RUNNING) {
        init = false;
        this.subscriptionFetchLogs = this.exporterService.fetchLogs(1000).subscribe({
          next: (response) => {
            this.exportLog = response;
            this.scrollToEndOfLog(exportDiv)
          },
          error: (error) => {
            console.log(error);
          },
          complete: () => {
          }
        });
      }
    }, 2000)
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
    this.generateExport();
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
}
