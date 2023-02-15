import {Injectable} from '@angular/core';
import {EmbeddedTeilerApp, EmbeddedTeilerApps, TeilerRole} from "./teiler-app";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class FunctionTestsService extends EmbeddedTeilerApp {

  description: string = $localize`Überprüfen Sie die Kommunikation mit anderen Komponenten`;
  iconClass: string = "bi bi-plugin";
  iconSourceUrl: string | undefined = undefined;
  title: string = $localize`Tests`;
  roles: TeilerRole[] = [TeilerRole.TEILER_ADMIN];

  constructor(router: Router) {
    super(EmbeddedTeilerApps.FUNCTION_TESTS, router);
  }

}
