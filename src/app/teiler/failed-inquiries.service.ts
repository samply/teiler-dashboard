import {Injectable} from '@angular/core';
import {EmbeddedTeilerApps} from "./teiler-app";
import {Router} from "@angular/router";
import {InquiriesService} from "./inquiries.service";
import {InquiriesClientService, Inquiry} from "../embedded/inquiries/inquiries-client.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FailedInquiriesService extends InquiriesService{

  description: string = $localize`Fehlgeschlagene Suchanfragen`;
  iconClass: string | undefined = "bi bi-exclamation-triangle";
  iconSourceUrl: string | undefined = undefined;
  title: string = $localize`Fehlgeschlagene Suchanfragen`;

  constructor(router: Router, private inquiriesClientService:InquiriesClientService) {
    super(EmbeddedTeilerApps.FAILED_INQUIRIES, router);
  }

  fetchInquiries(): Observable<Inquiry[]> {
    return this.inquiriesClientService.fetchFailedInquiries(this.backendUrl);
  }

}
