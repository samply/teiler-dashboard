import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {EmbeddedTeilerApp, EmbeddedTeilerApps, TeilerRole} from "./teiler-app";

@Injectable({
  providedIn: 'root'
})
export class DialogQualiService extends EmbeddedTeilerApp {

  constructor(router: Router) {
    super(EmbeddedTeilerApps.DIALOG_QUALI, router);
  }

  description: string = "";
  iconClass: string = "bi bi-123";
  iconSourceUrl: string | undefined;
  roles: TeilerRole[] = [TeilerRole.TEILER_USER];
  title: string = "";

}
