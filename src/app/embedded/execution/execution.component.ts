import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ExecutionService} from "../../teiler/execution.service";
import {Subscription} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {SelectionModel} from "@angular/cdk/collections";
import {environment} from "../../../environments/environment";
import {ExporterService} from "../../teiler/exporter.service";
import {DropdownFormat} from "../exporter/exporter.component";
import {Templates} from "../quality-report/quality-report.component";


export interface ExporterExecutions {
  id: number;
  queryId: number;
  templateId: string;
  outputFormat: string;
  status: string;
  executedAt: string;
}
export enum ExportStatus {
  OK = "OK",
  RUNNING = "RUNNING",
  NOT_FOUND = "NOT_FOUND",
  EMPTY = "EMPTY",
  ERROR = "ERROR"
}
export interface exportLog {
  source: string,
  lastLines: String[]
}
@Component({
  selector: 'execution',
  templateUrl: './execution.component.html',
  styleUrls: ['./execution.component.css']
})
export class ExecutionComponent implements OnInit, OnDestroy {
  displayedColumnsExecutions: string[] = ['executedAt', 'status', 'templateId', 'outputFormat'];
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
  queryID: number = 0;
  patients:any[] = [];
  diagnosen:any[] = [];
  panelOpenState = false;
  selection = new SelectionModel<any>(false, []);
  ExportStatus: typeof ExportStatus = ExportStatus;
  exportStatus: ExportStatus = ExportStatus.EMPTY;
  exportLog: exportLog[] = [];
  buttonDisabled: boolean = true;
  private intervall: number | undefined;
  expirationDate: Date | undefined;
  query: string = "";
  queryLabel: string = "";
  queryDescription: string = "";
  selectedTemplate: string = environment.config.EXPORTER_DEFAULT_TEMPLATE_ID;
  selectedOutputFormat: string = "JSON";
  selectedQueryFormat: string = "FHIR_SEARCH";
  exportUrl = "";
  fileName: string | undefined;
  importTemplate: string = "";
  outputFormats: DropdownFormat[] = [];
  queryFormats: DropdownFormat[] = [];
  templateIDs: Templates[] = [];
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

    this.route.params.subscribe(params => {
      this.queryID = params['id'];
      console.log(params['id'])
      if (window.history.state.newQueryID) {

      } else {
        this.getQueryExecutions();
      }
    })
    console.log(this.dataSourcePatients.data)
  }
  ngOnDestroy(): void {
    this.subscriptionGetExecutionList?.unsubscribe();
    this.subscriptionGetExecution?.unsubscribe();
    this.subscriptionGetTemplateGraph?.unsubscribe();
    this.subscriptionGetOutputFormats?.unsubscribe();
    this.subscriptionGetQueryFormats?.unsubscribe();
    this.subscriptionGetTemplateIDs?.unsubscribe();
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
            console.log(this.dataSourceExecutions.data)
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

  loadExecutionData(exec:ExporterExecutions): void {
    this.subscriptionGetExecution?.unsubscribe();
    this.subscriptionGetExecution = this.executionService.getExecutionData(exec.id).subscribe({
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

        this.getContainerData(data, this.templateGraph);
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
}
