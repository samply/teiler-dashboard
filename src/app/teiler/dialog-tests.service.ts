import {Injectable} from '@angular/core';
import {EmbeddedTeilerApp, EmbeddedTeilerApps, TeilerRole} from "./teiler-app";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class DialogTestsService extends EmbeddedTeilerApp {

  constructor(router: Router) {
    super(EmbeddedTeilerApps.DIALOG_TESTS, router);
  }

  description: string = "";
  iconClass: string = "bi bi-123";
  iconSourceUrl: string | undefined;
  roles: TeilerRole[] = [TeilerRole.TEILER_USER];
  title: string = "";

}
