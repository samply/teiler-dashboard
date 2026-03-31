import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import {Context, DropdownFormat, ExporterQueriesBox, QueryResponse} from "../exporter.component";
import {map, Observable, Subscription} from "rxjs";
import {StepperOrientation} from "@angular/cdk/stepper";
import {FormBuilder} from "@angular/forms";
import {BreakpointObserver} from "@angular/cdk/layout";
import {ExporterService} from "../../../teiler/exporter.service";
import {Templates} from "../../quality-report/quality-report.component";

export enum ExportStatus {
  OK = "OK",
  RUNNING = "RUNNING",
  NOT_FOUND = "NOT_FOUND",
  EMPTY = "EMPTY",
  ERROR = "ERROR"
}
@Component({
  selector: 'samply-edit-query-dialog',
  templateUrl: './edit-query-dialog.component.html',
  styleUrl: './edit-query-dialog.component.css',
  standalone: false
})
export class EditQueryDialogComponent implements OnInit, OnDestroy {
  private subscriptionGetOutputFormats: Subscription | undefined
  private subscriptionGetQueryFormats: Subscription | undefined
  private subscriptionGetTemplateIDs: Subscription | undefined
  private subscriptionUpdateQuery: Subscription | undefined
  private subscriptionCreateQuery: Subscription | undefined;
  executeOnSaving: boolean = false
  element: ExporterQueriesBox
  showStepper: boolean = true
  descriptionLoc = $localize`Beschreibung`
  queryLoc = $localize`Anfrage`
  outputLoc = $localize`Ausgabe`
  otherParametersLoc = $localize`weitere Parameter`
  summaryLoc = $localize`Zusammenfassung`
  firstFormGroup = this._formBuilder.group({
    queryTitle: [''],
    queryDescription: ['']
  });
  secondFormGroup = this._formBuilder.group({
    query: [''],
    queryformat: [''],
  });
  thirdFormGroup = this._formBuilder.group({
    template: [''],
    outputformat: [''],
  });
  forthFormGroup = this._formBuilder.group({
    expirationDate: [''],
    contextKey: [''],
    contextValue: ['']
  });
  fifthFormGroup = this._formBuilder.group({

  });
  buttonDisabled: boolean = true;
  editModus: boolean = true;
  stepperOrientation: Observable<StepperOrientation>;
  fileName: string | undefined;
  importTemplate: string = "";
  outputFormats: DropdownFormat[] = [];
  queryFormats: DropdownFormat[] = [];
  templateIDs: Templates[] = [];
  showPlusButton: boolean = false;
  exportUrl = "";
  ExportStatus: typeof ExportStatus = ExportStatus;
  exportStatus: ExportStatus = ExportStatus.EMPTY;
  exportLog: string[] = [];
  selectedOutputFormat: string = "EXCEL";
  constructor(@Inject(MAT_DIALOG_DATA) public data: ExporterQueriesBox, private exporterService: ExporterService, private dialogRef: MatDialogRef<EditQueryDialogComponent, boolean>, private _formBuilder: FormBuilder, breakpointObserver: BreakpointObserver) {
    this.element = data
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));

  }
  ngOnInit(): void {
    this.exportUrl = this.exporterService.getExporterURL() + "/";
    this.getTemplateIDs();
    this.getOutputFormats();
    this.getQueryFormats()

    this.element.defaultOutputFormat !== null && this.element.defaultOutputFormat !== undefined ? this.selectedOutputFormat = this.element.defaultOutputFormat : this.selectedOutputFormat = "EXCEL";
  }
  ngOnDestroy(): void {
    this.subscriptionGetOutputFormats?.unsubscribe();
    this.subscriptionGetQueryFormats?.unsubscribe();
    this.subscriptionGetTemplateIDs?.unsubscribe();
    this.subscriptionUpdateQuery?.unsubscribe();
    this.subscriptionCreateQuery?.unsubscribe();
  }

  generateButtonStatus(): void {
    this.buttonDisabled = (this.element.label === "")  || (this.element.query === "") || (this.element.description === "");
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
  addContextInput(element: any, index2: number): void {
    const scrollElement = element.target.parentNode.parentNode.parentNode;
    this.element.contextArray.push({key: "", value: ""} as Context);
    setTimeout(() => {
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }, 50);
    this.showPlusButton = false;
  }
  deleteContextInput(index: number): void {
    this.element.contextArray.splice(index, 1);
    this.checkContext(this.element.contextArray.length-1);
  }
  checkContext(index: number) {
    this.showPlusButton = this.element.contextArray[index].key.length > 0 && this.element.contextArray[index].value.length > 0;
  }
  downloadTemplate(): void {
    window.location.href = this.exportUrl + 'template?template-id=' + this.element.selectedTemplate;
  }
  getContext(): string {
    let context: string = "";
    this.element.contextArray.forEach(contextPair => {
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
  saveQuery(): void {
    this.subscriptionUpdateQuery?.unsubscribe();
    this.subscriptionCreateQuery?.unsubscribe();

    this.buttonDisabled = true;
    // const expDate = this.transformDateForQuery(this.expirationDate);

    if (this.element.loadedQueryID) {
      this.subscriptionUpdateQuery = this.exporterService.updateQuery(this.element.loadedQueryID, this.element.query, this.element.label, this.element.description, this.element.selectedOutputFormat, this.element.selectedTemplate, this.getContext(), this.element.expirationDate, this.importTemplate).subscribe({
        next: (response: any) => {
         // this.getQueries();
          this.editModus = false;
          this.buttonDisabled = false;
          if (this.executeOnSaving) {
            this.executeQuery();
          }
        },
        error: (error) => {
          console.log(error);
          this.editModus = false;
          this.buttonDisabled = false;
        },
        complete: () => {
          this.dialogRef.close(true)
        }
      });
    } else {
      this.subscriptionCreateQuery = this.exporterService.createQuery(this.element.query, this.element.label, this.element.description, this.element.selectedQueryFormat, this.element.selectedOutputFormat, this.element.contactId, this.element.selectedTemplate, this.getContext(), this.element.expirationDate, this.importTemplate).subscribe({
        next: (response: QueryResponse) => {
          // this.getQueries();
          this.editModus = false;
          this.buttonDisabled = false;
          if (this.executeOnSaving) {
            this.element.loadedQueryID = response.queryId;
            this.executeQuery();
          }
        },
        error: (error) => {
          console.log(error);
          this.editModus = false;
          this.buttonDisabled = false;
        },
        complete: () => {
          this.dialogRef.close(true)
        }
      });
    }

  }
  executeQuery(): void {
    console.log(this.showStepper)
    this.showStepper = false
  }
}

