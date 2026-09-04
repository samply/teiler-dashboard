import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Context, DropdownFormat, ExporterQueriesBox, QueryResponse, formatEnumDisplayLabel} from "../../exporter.component";
import {map, Observable, Subscription} from "rxjs";
import {StepperOrientation, StepperSelectionEvent} from "@angular/cdk/stepper";
import {FormBuilder} from "@angular/forms";
import {BreakpointObserver} from "@angular/cdk/layout";
import {ExporterService} from "../../../../teiler/exporter.service";
import {Templates} from "../../../quality-report/quality-report.component";

export interface QueryFormCompletedEvent {
  element: ExporterQueriesBox;
  execute: boolean;
  importTemplate: string;
}

@Component({
  selector: 'samply-query-form',
  templateUrl: './query-form.component.html',
  styleUrl: '../edit-query-dialog.component.css',
  standalone: false
})
export class QueryFormComponent implements OnInit, OnDestroy {
  @Input() element!: ExporterQueriesBox;
  @Output() completed = new EventEmitter<QueryFormCompletedEvent>();

  private subscriptionGetOutputFormats: Subscription | undefined;
  private subscriptionGetQueryFormats: Subscription | undefined;
  private subscriptionGetTemplateIDs: Subscription | undefined;
  private subscriptionUpdateQuery: Subscription | undefined;
  private subscriptionCreateQuery: Subscription | undefined;

  descriptionLoc = $localize`Beschreibung`
  queryLoc = $localize`Anfrage`
  outputLoc = $localize`Ausgabe`
  otherParametersLoc = $localize`Weitere Parameter`
  summaryLoc = $localize`Zusammenfassung`
  step1TooltipText = $localize`Bitte füllen Sie die Pflichtfelder "Titel" und "Beschreibung" aus.`
  step2TooltipText = $localize`Bitte füllen Sie das Pflichtfeld "Anfrage" aus.`
  visitedSteps: boolean[] = [true, false, false, false, false];
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
  fifthFormGroup = this._formBuilder.group({});
  buttonDisabled: boolean = true;
  editModus: boolean = true;
  executeOnSaving: boolean = false;
  stepperOrientation: Observable<StepperOrientation>;
  fileName: string | undefined;
  importTemplate: string = "";
  outputFormats: DropdownFormat[] = [];
  queryFormats: DropdownFormat[] = [];
  templateIDs: Templates[] = [];
  showPlusButton: boolean = false;
  exportUrl = "";

  constructor(private exporterService: ExporterService, private _formBuilder: FormBuilder, breakpointObserver: BreakpointObserver) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {
    const expirationMs = +this.element.expirationDate;
    this.element.expirationDate = expirationMs ? new Date(expirationMs).toISOString() : '';
    this.exportUrl = this.exporterService.getExporterURL() + "/";
    this.getTemplateIDs();
    this.getOutputFormats();
    this.getQueryFormats();
    this.showPlusButton = this.element.contextArray.length > 0 && !!this.element.contextArray[0].key && !!this.element.contextArray[0].value;
  }

  ngOnDestroy(): void {
    this.subscriptionGetOutputFormats?.unsubscribe();
    this.subscriptionGetQueryFormats?.unsubscribe();
    this.subscriptionGetTemplateIDs?.unsubscribe();
    this.subscriptionUpdateQuery?.unsubscribe();
    this.subscriptionCreateQuery?.unsubscribe();
  }

  generateButtonStatus(): void {
    this.buttonDisabled = (this.element.label === "") || (this.element.query === "") || (this.element.description === "");
  }

  onStepperSelectionChange(event: StepperSelectionEvent): void {
    this.visitedSteps[event.selectedIndex] = true;
  }

  get groupedTemplateIDs(): { label: string, items: Templates[] }[] {
    const groups: Record<string, Templates[]> = {};
    const order: string[] = [];
    this.templateIDs.forEach((template) => {
      if (template.value === 'custom') {
        return;
      }
      let groupLabel = $localize`Sonstige`;
      if (template.value.includes('ccp')) {
        groupLabel = 'CCP';
      } else if (template.value.includes('bbmri')) {
        groupLabel = 'BBMRI';
      }
      if (!groups[groupLabel]) {
        groups[groupLabel] = [];
        order.push(groupLabel);
      }
      groups[groupLabel].push(template);
    });
    order.sort((a, b) => (a === $localize`Sonstige` ? 1 : b === $localize`Sonstige` ? -1 : a.localeCompare(b)));
    return order.map((groupLabel) => ({label: groupLabel, items: groups[groupLabel]}));
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

  getQueryFormats(): void {
    this.subscriptionGetQueryFormats?.unsubscribe();
    this.subscriptionGetQueryFormats = this.exporterService.getQueryFormats().subscribe({
      next: (formatList: string[]) => {
        formatList.forEach((format) => {
          this.queryFormats.push({value: format, display: formatEnumDisplayLabel(format)})
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
      next: (templateList: string[]) => {
        templateList.forEach((template) => {
          this.templateIDs.push({value: template, display: template})
        })
        this.templateIDs.push({value: "custom", display: "Eigenes Template"})
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  addContextInput(event: any, index: number): void {
    const scrollElement = event.target.parentNode.parentNode.parentNode;
    this.element.contextArray.push({key: "", value: ""} as Context);
    setTimeout(() => {
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }, 50);
    this.showPlusButton = false;
  }

  deleteContextInput(index: number): void {
    this.element.contextArray.splice(index, 1);
    this.checkContext(this.element.contextArray.length - 1);
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
    return btoa(context);
  }

  transformDateForQuery(date: Date | undefined): string {
    if (date) {
      const offset = date.getTimezoneOffset();
      date = new Date(date.getTime() - (offset * 60 * 1000));
      return date.toISOString().split('T')[0];
    } else {
      return "";
    }
  }

  saveQuery(executeAfter: boolean = false): void {
    this.subscriptionUpdateQuery?.unsubscribe();
    this.subscriptionCreateQuery?.unsubscribe();

    this.executeOnSaving = executeAfter;
    this.buttonDisabled = true;

    const date = this.transformDateForQuery(this.element.expirationDate as unknown as Date)
    if (this.element.loadedQueryID) {
      this.subscriptionUpdateQuery = this.exporterService.updateQuery(this.element.loadedQueryID, this.element.query, this.element.label, this.element.description, this.element.selectedOutputFormat, this.element.selectedTemplate, this.getContext(), date, this.importTemplate).subscribe({
        next: () => {
          this.editModus = false;
          this.buttonDisabled = false;
        },
        error: (error) => {
          console.log(error);
          this.editModus = false;
          this.buttonDisabled = false;
        },
        complete: () => {
          this.completed.emit({element: this.element, execute: this.executeOnSaving, importTemplate: this.importTemplate});
        }
      });
    } else {
      this.subscriptionCreateQuery = this.exporterService.createQuery(this.element.query, this.element.label, this.element.description, this.element.selectedQueryFormat, this.element.selectedOutputFormat, this.element.contactId, this.element.selectedTemplate, this.getContext(), date, this.importTemplate).subscribe({
        next: (response: QueryResponse) => {
          this.editModus = false;
          this.buttonDisabled = false;
          this.element.loadedQueryID = response.queryId;
        },
        error: (error) => {
          console.log(error);
          this.editModus = false;
          this.buttonDisabled = false;
        },
        complete: () => {
          this.completed.emit({element: this.element, execute: this.executeOnSaving, importTemplate: this.importTemplate});
        }
      });
    }
  }

  saveAndExecute(): void {
    this.saveQuery(true);
  }
}
