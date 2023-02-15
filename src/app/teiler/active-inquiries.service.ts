import {Injectable} from '@angular/core';
import {EmbeddedTeilerApps} from "./teiler-app";
import {Router} from "@angular/router";
import {InquiriesService} from "./inquiries.service";
import {InquiriesClientService, Inquiry} from "../embedded/inquiries/inquiries-client.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ActiveInquiriesService extends InquiriesService{

  description: string = $localize`Aktive Suchanfragen`;
  iconClass: string | undefined = "bi bi-inbox";
  iconSourceUrl: string | undefined = undefined;
  title: string = $localize`Aktive Suchanfragen`;

  constructor(router: Router, private inquiriesClientService:InquiriesClientService) {
    super(EmbeddedTeilerApps.ACTIVE_INQUIRIES, router);
  }

  fetchInquiries(): Observable<Inquiry[]> {
    return this.inquiriesClientService.fetchActiveInquiries(this.backendUrl);
  }

}
