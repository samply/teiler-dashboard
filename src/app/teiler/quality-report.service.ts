import {Injectable} from '@angular/core';
import {EmbeddedTeilerApp, EmbeddedTeilerApps, TeilerRole} from "./teiler-app";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class QualityReportService extends EmbeddedTeilerApp {

  description: string = $localize`Qualitätsberichte erzeugen und ansehen`;
  iconClass: string = "bi bi-file-earmark-excel-fill";
  iconSourceUrl: string | undefined = undefined;
  title: string = $localize`Qualitätsbericht`;
  roles: TeilerRole[] = [TeilerRole.TEILER_ADMIN];

  constructor(router: Router) {
    super(EmbeddedTeilerApps.QUALITY_REPORT, router);
  }

}
