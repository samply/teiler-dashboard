import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConfigurationService} from "./configuration.service";
import {QualityReportService} from "./quality-report.service";
import {TeilerService} from "./teiler.service";
import {TeilerConfigService} from "./teiler-config.service";
import {FunctionTestsService} from "./function-tests.service";
import {EventLogService} from "./event-log.service";
import {UploadsService} from "./uploads.service";
import {ActiveInquiriesService} from "./active-inquiries.service";
import {FailedInquiriesService} from "./failed-inquiries.service";
import {ArchivedInquiriesService} from "./archived-inquiries.service";
import {InquiryService} from "./inquiry.service";
import {DialogUploadsService} from "./dialog-uploads.service";
import {DialogQualiService} from "./dialog-quali.service";
import {InquiryDialogService} from "./inquiry-dialog.service";
import {DialogTestsService} from "./dialog-tests.service";


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [],
  providers: [
    ConfigurationService,
    QualityReportService,
    FunctionTestsService,
    EventLogService,
    TeilerService,
    TeilerConfigService,
    UploadsService,
    ActiveInquiriesService,
    FailedInquiriesService,
    ArchivedInquiriesService,
    InquiryService,
    DialogUploadsService,
    DialogQualiService,
    InquiryDialogService,
    DialogTestsService]
})
export class TeilerModule {
}
