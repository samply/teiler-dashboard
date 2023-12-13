import {Injectable} from '@angular/core';
import {EmbeddedTeilerApp, EmbeddedTeilerApps, TeilerRole} from "./teiler-app";
import {Router} from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class InquiryService extends EmbeddedTeilerApp{

  constructor(router: Router) {
    super(EmbeddedTeilerApps.INQUIRY, router);
  }

  description: string = "";
  iconClass: string | undefined = undefined;
  iconSourceUrl: string | undefined = undefined;
  roles: TeilerRole[] = [TeilerRole.TEILER_USER];
  title: string = "";
  routerLinkExtension: string = "/:id";

}
