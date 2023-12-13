import {Injectable} from '@angular/core';
import {EmbeddedTeilerApps, BackgroundColors} from "./teiler-app";
import {Router} from "@angular/router";
import {InquiriesService} from "./inquiries.service";
import {InquiriesClientService, Inquiry} from "../embedded/inquiries/inquiries-client.service";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ArchivedInquiriesService extends InquiriesService{

  description: string = $localize`Archivierte Suchanfragen`;
  iconClass: string | undefined = "bi bi-archive";
  iconSourceUrl: string | undefined = undefined;
  title: string = $localize`Archivierte Suchanfragen`;
  override backgroundColor: BackgroundColors = BackgroundColors.BLUE;

  constructor(router: Router, private inquiriesClientService:InquiriesClientService) {
    super(EmbeddedTeilerApps.ARCHIVED_INQUIRIES, router);
  }

  fetchInquiries(): Observable<Inquiry[]> {
    return this.inquiriesClientService.fetchArchivedInquiries(this.backendUrl);
  }

}
