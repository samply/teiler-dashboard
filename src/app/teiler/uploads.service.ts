import {Injectable} from '@angular/core';
import {EmbeddedTeilerApp, EmbeddedTeilerApps, TeilerRole, BackgroundColors} from "./teiler-app";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class UploadsService extends EmbeddedTeilerApp{

  description: string = $localize`Lädt Patienten in die Zentrale Suche`;
  iconClass: string | undefined = "bi bi-cloud-upload";
  iconSourceUrl: string | undefined = undefined;
  roles: TeilerRole[] = [TeilerRole.TEILER_ADMIN];
  title: string = $localize`Uploads`;
  override backgroundColor: BackgroundColors = BackgroundColors.BLUE;

  constructor(router: Router) {
    super(EmbeddedTeilerApps.UPLOADS, router);
  }


}
