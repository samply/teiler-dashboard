import { Injectable } from '@angular/core';
import {EmbeddedTeilerApp, EmbeddedTeilerApps, TeilerRole} from "./teiler-app";
    import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {ExporterQueries} from "../embedded/exporter/exporter.component";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {createRouterLinkForBase} from "../route/route-utils";

@Injectable({
  providedIn: 'root'
})
export class ExporterService extends EmbeddedTeilerApp {

	description: string = "";
	iconClass: string | undefined = 'bi bi-person-rolodex';
	iconSourceUrl: string | undefined = undefined;
	title: string = "Exporter";
	roles: TeilerRole[] = [TeilerRole.TEILER_ADMIN];
  httpHeaders: HttpHeaders = new HttpHeaders().append("x-api-key", environment.config.EXPORTER_API_KEY);

	constructor(router: Router, private http: HttpClient) {
    super(EmbeddedTeilerApps.EXPORTER, router);
	}

  getReports(): Observable<ExporterQueries[]> {
    return this.http.get<ExporterQueries[]>(this.getExporterURL()+"/queries" ,{headers: this.httpHeaders});
  }

  getExporterURL(): string | undefined {
    return this.backendUrl;
  }

  getExecutionRouterLink(id: string): string {
    return '/' + createRouterLinkForBase(EmbeddedTeilerApps.EXECUTION + '/' + id);
  }
}
