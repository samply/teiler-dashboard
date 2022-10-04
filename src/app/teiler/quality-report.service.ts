import {Injectable} from '@angular/core';
import {EmbeddedTeilerApp, EmbeddedTeilerApps, TeilerRole} from "./teiler-app";

@Injectable({
  providedIn: 'root'
})
export class QualityReportService extends EmbeddedTeilerApp {

  description: string = "Generate and download quality reports";
  iconClass: string = "bi bi-file-earmark-excel-fill";
  iconSourceUrl: string | undefined = undefined;
  title: string = "Quality Report";
  roles: TeilerRole[] = [TeilerRole.TEILER_ADMIN];

  constructor() {
    super(EmbeddedTeilerApps.QUALITY_REPORT);
  }

}
