import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ExecutionService} from "../../teiler/execution.service";
import {Subscription} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {SelectionModel} from "@angular/cdk/collections";
import {environment} from "../../../environments/environment";
import {ExporterService} from "../../teiler/exporter.service";
import {Context, DropdownFormat, ExportResponse} from "../exporter/exporter.component";
import {Templates} from "../quality-report/quality-report.component";


export interface ExporterExecutions {
  id: number;
  queryId: number;
  templateId: string;
  outputFormat: string;
  status: string;
  executedAt: string;
}
export interface ExecutionError {
  id: number;
  queryExecutionId: number;
  error: string;
}
export enum ExportStatus {
  OK = "OK",
  RUNNING = "RUNNING",
  NOT_FOUND = "NOT_FOUND",
  EMPTY = "EMPTY",
  ERROR = "ERROR"
}

@Component({
  selector: 'execution',
  templateUrl: './execution.component.html',
  styleUrls: ['./execution.component.css']
})
export class ExecutionComponent implements OnInit, OnDestroy {
  displayedColumnsExecutions: string[] = ['executedAt', 'status', 'templateId', 'outputFormat', 'link'];
  displayedColumnsPatients: string[] = ['#', 'Patient-ID', 'Geschlecht', 'Geburtsdatum', 'Vitalstatus', 'DKTK-ID-Lokal'];
  displayedColumnsDiagnosis: string[] = ['#', 'Diagnosis-ID', 'Primärdiagnose', 'Tumor Diagnosedatum', 'Version des ICD-10-Katalogs'];
  dataSourceExecutions = new MatTableDataSource<ExporterExecutions>();
  dataSourcePatients = new MatTableDataSource();
  dataSourceDiagnosis = new MatTableDataSource();
  private subscriptionGetExecutionList: Subscription | undefined
  private subscriptionGetExecution: Subscription | undefined
  private subscriptionGetTemplateGraph: Subscription | undefined
  private subscriptionGetOutputFormats: Subscription | undefined
  private subscriptionGetQueryFormats: Subscription | undefined
  private subscriptionGetTemplateIDs: Subscription | undefined
  private subscriptionGetExportStatus: Subscription | undefined
  private subscriptionFetchLogs: Subscription | undefined
  private subscriptionGetQuery: Subscription | undefined
  private subscriptionExecuteQuery: Subscription | undefined
  queryID: number = 0;
  patients:any[] = [];
  diagnosen:any[] = [];
  panelOpenState = false;
  selection = new SelectionModel<any>(false, []);
  ExportStatus: typeof ExportStatus = ExportStatus;
  exportStatus: ExportStatus = ExportStatus.EMPTY;
  exportLog: string[] = [];
  buttonDisabled: boolean = false;
  private intervall: number | undefined;
  expirationDate: Date | undefined;
  query: string = "";
  queryLabel: string = "";
  queryDescription: string = "";
  selectedTemplate: string = environment.config.EXPORTER_DEFAULT_TEMPLATE_ID;
  selectedOutputFormat: string = "EXCEL";
  selectedQueryFormat: string = "FHIR_SEARCH";
  exportUrl = "";
  fileName: string | undefined;
  importTemplate: string = "";
  outputFormats: DropdownFormat[] = [];
  queryFormats: DropdownFormat[] = [];
  templateIDs: Templates[] = [];
  contactID: string | undefined;
  contextArray: Context[] = [{key: "", value: ""}];
  templateGraph = {
    "containers" : [ {
      "linked-attribute" : [ {
        "linking-attribute" : [ {
          "attribute" : "Patient-ID",
          "container" : "Diagnoses"
        }, {
          "attribute" : "Patient-ID",
          "container" : "Progress"
        }, {
          "attribute" : "Patient-ID",
          "container" : "Histologies"
        }, {
          "attribute" : "Patient-ID",
          "container" : "Metastases"
        }, {
          "attribute" : "Patient-ID",
          "container" : "TNMs"
        }, {
          "attribute" : "Patient-ID",
          "container" : "System Therapies"
        }, {
          "attribute" : "Patient-ID",
          "container" : "Surgeries"
        }, {
          "attribute" : "Patient-ID",
          "container" : "Radiation Therapies"
        }, {
          "attribute" : "Patient-ID",
          "container" : "Molecular Markers"
        }, {
          "attribute" : "Patient-ID",
          "container" : "Samples"
        } ],
        "attribute" : "Patient-ID"
      } ],
      "container" : "Patients"
    }, {
      "linked-attribute" : [ {
        "linking-attribute" : [ {
          "attribute" : "Diagnosis-ID",
          "container" : "Progress"
        }, {
          "attribute" : "Diagnosis-ID",
          "container" : "Histologies"
        }, {
          "attribute" : "Diagnosis-ID",
          "container" : "Metastases"
        }, {
          "attribute" : "Diagnosis-ID",
          "container" : "TNMs"
        }, {
          "attribute" : "Diagnosis-ID",
          "container" : "System Therapies"
        }, {
          "attribute" : "Diagnosis-ID",
          "container" : "Surgeries"
        }, {
          "attribute" : "Diagnosis-ID",
          "container" : "Radiation Therapies"
        }, {
          "attribute" : "Diagnosis-ID",
          "container" : "Molecular Markers"
        } ],
        "attribute" : "Diagnosis-ID"
      } ],
      "container" : "Diagnoses"
    }, {
      "linked-attribute" : [ ],
      "container" : "Progress"
    }, {
      "linked-attribute" : [ ],
      "container" : "Histologies"
    }, {
      "linked-attribute" : [ ],
      "container" : "Metastases"
    }, {
      "linked-attribute" : [ ],
      "container" : "TNMs"
    }, {
      "linked-attribute" : [ ],
      "container" : "System Therapies"
    }, {
      "linked-attribute" : [ ],
      "container" : "Surgeries"
    }, {
      "linked-attribute" : [ ],
      "container" : "Radiation Therapies"
    }, {
      "linked-attribute" : [ ],
      "container" : "Molecular Markers"
    }, {
      "linked-attribute" : [ ],
      "container" : "Samples"
    } ]
  }

  constructor(private route: ActivatedRoute, private executionService: ExecutionService, private exporterService: ExporterService) {}

  // @ts-ignore
  @ViewChild('paginator') paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSourceExecutions.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.exportUrl = this.exporterService.getExporterURL() + "/";
    this.getTemplateIDs();
    this.getOutputFormats();
    this.getQueryFormats();

    this.route.params.subscribe(params => {
      this.queryID = params['id'];
      console.log(params['id']);

      this.getQuery();
      //this.query = window.history.state.query;
      //this.queryLabel = window.history.state.label;
      //this.queryDescription = window.history.state.description;
      //this.selectedQueryFormat = window.history.state.selectedQueryFormat?.toUpperCase();
      //this.selectedOutputFormat = window.history.state.selectedOutputFormat.toUpperCase() as string;
      //this.selectedTemplate = window.history.state.selectedTemplate.toUpperCase();
      const execID = window.history.state.newExecID;
      if (execID) {
        this.panelOpenState = true;
        this.buttonDisabled = true;
        this.pollingStatusAndLogs(execID, false);
      }

      this.getQueryExecutions();
    })
    //this.getExecutionError(1)
    //console.log(this.dataSourcePatients.data)
    window.dispatchEvent(new Event('resize'));
  }
  ngOnDestroy(): void {
    this.subscriptionGetExecutionList?.unsubscribe();
    this.subscriptionGetExecution?.unsubscribe();
    this.subscriptionGetTemplateGraph?.unsubscribe();
    this.subscriptionGetOutputFormats?.unsubscribe();
    this.subscriptionGetQueryFormats?.unsubscribe();
    this.subscriptionGetTemplateIDs?.unsubscribe();
    this.subscriptionGetExportStatus?.unsubscribe();
    this.subscriptionFetchLogs?.unsubscribe();
    this.subscriptionGetQuery?.unsubscribe();
    this.subscriptionExecuteQuery?.unsubscribe();
  }

  getQuery(): void {
    this.subscriptionGetQuery?.unsubscribe();
    this.subscriptionGetQuery = this.executionService.getQuery(this.queryID).subscribe({
      next: (query) => {
        this.query = query.query;
        this.queryLabel = query.label;
        this.queryDescription = query.description;
        this.selectedQueryFormat = query.format;
        this.contactID = query.contactId;
        query.defaultOutputFormat !== null && query.defaultOutputFormat !== undefined ? this.selectedOutputFormat = query.defaultOutputFormat : this.selectedOutputFormat = "EXCEL";
        query.defaultTemplateId !== null && query.defaultTemplateId !== undefined ? this.selectedTemplate = query.defaultTemplateId : this.selectedTemplate = environment.config.EXPORTER_DEFAULT_TEMPLATE_ID;

        query.expirationDate !== null ? this.expirationDate = new Date(query.expirationDate) : this.expirationDate = undefined;

        if (query.context !== null) {
          this.contextArray = [];
          atob(query.context).split(';').forEach((context) => {
            const contextPair = context.split('=');
            this.contextArray.push({key: contextPair[0], value: contextPair[1]} as Context);
          })
        } else {
          this.contextArray = [{key: "", value: ""} as Context];
        }

      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {}
    })
  }
  getQueryExecutions(): void {
    this.subscriptionGetExecutionList?.unsubscribe();
    this.subscriptionGetExecutionList = this.executionService.getExecutionList(this.queryID).subscribe({
      next: (execs) => {
        const tempExecs: ExporterExecutions[] = [];
        execs.forEach((execution) => {
          if (execution.queryId == this.queryID) {
            tempExecs.push({
              id: execution.id,
              queryId: execution.queryId,
              templateId: execution.templateId,
              outputFormat: execution.outputFormat,
              status: execution.status,
              executedAt: this.transformDate(execution.executedAt)
            })
            tempExecs.sort((a,b) =>  Number(b.executedAt) - Number(a.executedAt))
            this.dataSourceExecutions.data = tempExecs;
            this.dataSourceExecutions._updateChangeSubscription();
          }
        })
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {}
    })
  }

  executeQuery(): void {
    this.buttonDisabled = true;
    this.panelOpenState = true;
    this.subscriptionExecuteQuery?.unsubscribe();
    this.subscriptionExecuteQuery = this.exporterService.executeQuery(this.queryID.toString(), this.selectedOutputFormat, this.selectedTemplate, this.importTemplate).subscribe({
      next: (response: ExportResponse) => {
        const url = new URL(response.responseUrl)
        const id = url.searchParams.get("query-execution-id");
        if (id) {
          this.pollingStatusAndLogs(id, false);
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {}
    });

  }
  pollingStatusAndLogs(id: string, init: boolean): void {
    this.subscriptionGetExportStatus?.unsubscribe();
    this.subscriptionFetchLogs?.unsubscribe();
    setTimeout(() => {
      this.getQueryExecutions();
    }, 1000);
    this.exportStatus = ExportStatus.RUNNING
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
              if (this.selectedOutputFormat !== 'OPAL') {this.downloadExport(id)}
              setTimeout(() => {
                this.getQueryExecutions();
              }, 2000);

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
            console.log(response)
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

  getExecutionError(execID: number): void {
    this.executionService.getExecutionError(execID).subscribe({
      next: (execError) => {
        console.log(execError[0].error)
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
      }
    })
  }

  getExecutionDataInBody(exec:ExporterExecutions): void {
    this.subscriptionGetExecution?.unsubscribe();
    this.subscriptionGetExecution = this.executionService.getExecutionDataInBody(exec.id).subscribe({
      next: (data) => {
        this.subscriptionGetTemplateGraph = this.executionService.getTemplateGraph(exec.id).subscribe({
          next: (templGraph) => {
            this.getContainerData(data, templGraph);
          },
          error: (error) => {
            console.log(error);
          },
          complete: () => {
          }
        })

        //this.getContainerData(data, this.templateGraph);
/*
            data[0].Patients.forEach((patient: any) => {
              const diag = [...data[1].Diagnoses.filter((x: any)=> x["Patient-ID"] === patient["Patient-ID"])];  //... = spread operator, shallow copy
              diag.forEach((diagn: any) => {
                //delete diagn["Diagnosis-ID"]
                this.diagnosen.push(diagn)
              })
              //diagnosen.shift();
              //console.log(this.diagnosen)
            })
*/





      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
      }
    })
    console.log(exec)
  }

  getContainerData(data: any, graph: any): void {
    const firstContainer = graph.containers[0].container
    const linkedAttributes = graph.containers[0]["linked-attribute"]
    const firstData = data.find((x: string)=> Object.entries(x)[0][0] === firstContainer)

    console.log('bla')
    console.log(data)
    console.log(firstData)
    this.patients = firstData[firstContainer];
    this.dataSourcePatients.data = this.patients;
    this.dataSourcePatients._updateChangeSubscription();

    const linkedContainer = linkedAttributes[0]["linking-attribute"][0].container;
    const secondData= data.find((x: string)=> Object.entries(x)[0][0] === linkedContainer)
    this.diagnosen = secondData[linkedContainer]


  }
  transformDate(date: string): string {
    return new Date(date).getTime().toString();
  }

  generateExport(): void {

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

  cancelExecution(): void {
    window.clearInterval(this.intervall);
    this.buttonDisabled = false;
    this.exportStatus = ExportStatus.EMPTY;
  }
  switchToPatient():void {
    this.displayedColumnsPatients = ['Patient-ID', 'Geschlecht', 'Geburtsdatum', 'Vitalstatus'];
    this.dataSourcePatients.data = this.patients;
    this.dataSourcePatients._updateChangeSubscription();
  }
  switchToDiag():void {
    this.displayedColumnsPatients = ['Patient-ID', 'Primärdiagnose', 'Tumor Diagnosedatum', 'Version des ICD-10-Katalogs'];
    this.dataSourcePatients.data = this.diagnosen;
    this.dataSourcePatients._updateChangeSubscription();
  }

  toggleCheckbox(event: any, row: any): void {
    event ? this.selection.toggle(row) : null;


    const diag = this.diagnosen.filter((x: any)=> x["Patient-ID"] === row["Patient-ID"]);
    this.dataSourceDiagnosis.data = diag;
    this.dataSourceDiagnosis._updateChangeSubscription();
    console.log(this.diagnosen)
    console.log('selection')
    console.log(this.selection.selected)
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
  generateButtonStatus(): void {
    this.buttonDisabled = (this.queryLabel === "")  || (this.query === "") || (this.queryDescription === "");
  }
  downloadTemplate(): void {
    window.location.href = this.exportUrl + 'template?template-id=' + this.selectedTemplate;
  }
  downloadExport(id: string): void {
    window.location.href=this.exportUrl + 'response?query-execution-id=' + id;
  }
}
