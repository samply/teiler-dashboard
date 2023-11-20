import { Injectable } from '@angular/core';
import {EmbeddedTeilerApp, EmbeddedTeilerApps, TeilerRole} from "./teiler-app";
    import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {ExporterQueries, ExportResponse, ExportStatus} from "../embedded/exporter/exporter.component";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {createRouterLinkForBase} from "../route/route-utils";


export interface exportLog {
  source: string,
  lastLines: String[]
}
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
  httpHeadersXML: HttpHeaders = new HttpHeaders().append("x-api-key", environment.config.EXPORTER_API_KEY).append("Content-Type",  "application/xml");

	constructor(router: Router, private http: HttpClient) {
    super(EmbeddedTeilerApps.EXPORTER, router);
	}

  getReports(): Observable<ExporterQueries[]> {
    return this.http.get<ExporterQueries[]>(this.getExporterURL()+"/queries" ,{headers: this.httpHeaders});
  }
  getExporterTemplates(): Observable<string[]> {
    return this.http.get<string[]>(this.getExporterURL() + "/template-ids");
  }
  getOutputFormats(): Observable<string[]> {
    return this.http.get<string[]>(this.getExporterURL() + "/output-formats");
  }
  getQueryFormats(): Observable<string[]> {
    return this.http.get<string[]>(this.getExporterURL() + "/input-formats");
  }
  public generateExport(query: string, queryLabel: string, queryDescription: string, queryFormat: string, outputFormat: string, templateID: string, template?:string): Observable<ExportResponse> {
    let qLabel: string = "";
    let qDesc: string = "";
    if (queryLabel && queryLabel !== "") { qLabel = "&query-label=" + queryLabel}
    if (queryDescription && queryDescription !== "") { qDesc = "&query-description=" + queryDescription}
    if (templateID === "custom") {
      return this.http.post<ExportResponse>(this.getExporterURL()+"/request?query="+ query +"&query-format=" + queryFormat + "&output-format=" + outputFormat + qLabel + qDesc, template, {headers: this.httpHeadersXML});
    } else {
      return this.http.post<ExportResponse>(this.getExporterURL() + "/request?query="+ query +"&query-format=" + queryFormat + "&output-format=" + outputFormat + "&template-id=" + templateID + qLabel + qDesc, null, {headers: this.httpHeaders});
    }
  }
  getExportStatus(exexID: string): Observable<ExportStatus> {
    return this.http.get<ExportStatus>(this.getExporterURL()+"/status?query-execution-id=" + exexID ,{headers: this.httpHeaders});
  }
  public fetchLogs(logSize: number, lastLineRep?: string, lastLineExp?: string): Observable<exportLog[]> {
    return this.http.get<exportLog[]>(this.getExporterURL()+"/logs?logs-size=" + logSize ,{headers: this.httpHeaders});
  }
  getExporterURL(): string | undefined {
    return this.backendUrl;
  }

  getExecutionRouterLink(id: string): string {
    return '/' + createRouterLinkForBase(EmbeddedTeilerApps.EXECUTION + '/' + id);
  }
}
