import {Injectable} from '@angular/core';
import {EmbeddedTeilerApp, EmbeddedTeilerApps, TeilerRole} from "./teiler-app";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class EventLogService extends EmbeddedTeilerApp {

  description: string = $localize`Ereignisse überprüfen`;
  iconClass: string = "bi bi-book";
  iconSourceUrl: string | undefined = undefined;
  title: string = $localize`Ereignislog`;
  roles: TeilerRole[] = [TeilerRole.TEILER_ADMIN];

  constructor(router: Router) {
    super(EmbeddedTeilerApps.EVENT_LOG, router);
  }

}
