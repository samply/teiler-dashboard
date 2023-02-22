import {AfterViewChecked, Component} from '@angular/core';
import {ConfigBlock, ConfigVariable, TeilerConfigService} from "../../teiler/teiler-config.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";


@Component({
  selector: 'configuration-app',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements AfterViewChecked {


  createConfigFileLinkId: string = "createConfigFileLink";

  configFileUrl: SafeResourceUrl | undefined;
  configFileContent: string = "";
  valuesFormGroup: FormGroup = this.formBuilder.group({configValues: this.formBuilder.array([])});
  variableValueFormMap: Map<string, FormGroup> = new Map<string, FormGroup>();
  defaultValueFormGroup = this.createValueFormGroup('');
  downloadNow: boolean = false;
  allSectionsOpen: boolean = false;

  constructor(public teilerConfigService: TeilerConfigService,
              private domSanitizer: DomSanitizer,
              private formBuilder: FormBuilder) {
    teilerConfigService.configBlocksbehaviorSubject.subscribe(configBlocks => {
      this.updateConfigFileUrl();
      this.updateVariableValueFormMap(configBlocks);
    });
  }

  isNotEmpty(line: string): boolean {
    return line.length > 0;
  }

  updateConfigFileUrl() {
    this.updateConfigFileContent();
    let blob = new Blob([this.configFileContent], {type: 'text/plain'});
    this.configFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
  }

  updateConfigFileContent() {

    this.configFileContent = "";
    this.teilerConfigService.configBlocks.forEach(configBlock => {
      configBlock.blockComment.forEach(blockComment => this.addLine('####', blockComment));
      if (configBlock.title != undefined) {
        this.addLine('###', configBlock.title);
      }
      configBlock.titleComment.forEach(titleComment => this.addLine('##', titleComment));
      configBlock.variables.forEach(variable => {
        variable.variableComment.forEach(variableComment => this.addLine('#', variableComment));
        this.addLine('', variable.variable + '=' + this.getVariableValue(variable));
      })
      this.addEndOfBlock();
    })
  }

  getVariableValue(configVariable: ConfigVariable): string {
    let result: string = configVariable.value;
    let formGroup: FormGroup | undefined = this.variableValueFormMap.get(configVariable.variable);
    if (formGroup != undefined && formGroup.value.configValue != undefined) {
      result = formGroup.value.configValue;
    }
    if (result == null) {
      result = '';
    }
    return result;
  }

  addLine(prefix: string, line: string) {
    this.configFileContent += prefix + line + '\n';
  }

  addEndOfBlock() {
    this.configFileContent += '\n\n';
  }

  updateConfigFileContentAndPrepareForDownload() {
    this.updateConfigFileUrl();
    this.downloadNow = true;
  }


  updateVariableValueFormMap(configBlocks: ConfigBlock[]) {

    this.variableValueFormMap.clear();
    if (configBlocks.length > 0) {
      configBlocks.map(configBlock => configBlock.variables).flat().forEach(configVariable => {
        let valueFormGroup = this.createValueFormGroup(configVariable.value);
        (this.valuesFormGroup.controls['configValues'] as FormArray).push(valueFormGroup);
        this.variableValueFormMap.set(configVariable.variable, valueFormGroup);
      })
    }

  }

  createValueFormGroup(value: string | undefined): FormGroup {
    return this.formBuilder.group({
      configValue: [value ?? '']
    });
  }

  ngAfterViewChecked() {
    if (this.downloadNow) {
      this.download();
      this.downloadNow = false;
    }
  }

  download(){
    console.log("downloading...");
    // @ts-ignore
    let a = document.getElementById(this.createConfigFileLinkId);
    // @ts-ignore
    a.click();
  }

  
  toggleSection(configBlockName: string, onlyOpenSection: boolean = false) {
    this.teilerConfigService.configBlocks.forEach(configBlock => {
      if (configBlock.title == configBlockName) {
        console.log("allSectionsOpen: " + this.allSectionsOpen + ", onlyOpenSection: " + onlyOpenSection + ", configBlock.open: " + configBlock.open + ", configBlockName: " + configBlockName);
        configBlock.open = onlyOpenSection ? true : !configBlock.open;
      }
    })
  }

  toggleAllSections() {
    this.teilerConfigService.configBlocks.forEach(configBlock => {
      configBlock.open = !this.allSectionsOpen ? true: false;
    })
    this.allSectionsOpen = !this.allSectionsOpen;
  }

}
