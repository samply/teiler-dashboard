import {Injectable} from '@angular/core';
import {EmbeddedTeilerApp, EmbeddedTeilerApps, TeilerRole} from "./teiler-app";
import {Router} from "@angular/router";
import {Inquiry} from "../embedded/inquiries/inquiries-client.service";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export abstract class InquiriesService extends EmbeddedTeilerApp {

  roles: TeilerRole[] = [TeilerRole.TEILER_USER];
  //subroutes: TeilerAppRoute[] = [{path: createRouterLinkForBase(this.router, inquiryPath + '/:id'), teilerAppName: EmbeddedTeilerApps.INQUIRY}];

  constructor(name: EmbeddedTeilerApps, private router: Router) {
    super(name, router);
  }

  abstract fetchInquiries(): Observable<Inquiry[]>;

}
