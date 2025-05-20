import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {QualityReportService} from "./quality-report.service";
import {TeilerService} from "./teiler.service";
import {TeilerConfigService} from "./teiler-config.service";
import {ExporterService} from "./exporter.service";
import {ExecutionService} from "./execution.service";


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [],
  providers: [
    QualityReportService,
    TeilerService,
    TeilerConfigService,
		ExporterService,
		ExecutionService]
})
export class TeilerModule {
}
