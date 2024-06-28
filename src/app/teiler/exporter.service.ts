import { Injectable } from '@angular/core';
import {EmbeddedTeilerApp, EmbeddedTeilerApps, TeilerRole} from "./teiler-app";
    import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {ExporterQueries, ExportResponse, ExportStatus, QueryResponse} from "../embedded/exporter/exporter.component";
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

	description: string = $localize`Verwenden Sie den Exporter, um Ihre Daten flexibel in unterschiedliche Formate zu exportieren, und passen Sie die Daten an Ihre spezifischen Anforderungen an.Verwenden Sie den Exporter, um Ihre Daten flexibel in unterschiedliche Formate zu exportieren, und passen Sie die Daten an Ihre spezifischen Anforderungen an.`;
	iconClass: string | undefined = 'bi bi-download';
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
  public createQuery(query: string, queryLabel: string, queryDescription: string, queryFormat: string, outputFormat: string, contactID: string | undefined, templateID: string, context: string, expDate: string, template?:string): Observable<QueryResponse> {
    let qLabel: string = "";
    let qDesc: string = "";
    let contactid = "";
    let qContext: string = "";
    let expiration: string = "";
    if (queryLabel && queryLabel !== "") {qLabel = "&query-label=" + queryLabel}
    if (queryDescription && queryDescription !== "") {qDesc = "&query-description=" + queryDescription}
    if (contactID && contactID !== "") {contactid = "&query-contact-id=" + contactID}
    if (context && context.length !== 0) { qContext = "&query-context=" + context}
    if (expDate.length > 0) {expiration = "&query-expiration-date=" + expDate}
    if (templateID === "custom") {
      const templateBody ="<request><query>" + query + "</query>" + template + "</request>"
      return this.http.post<QueryResponse>(this.getExporterURL() + "/create-query?query-format=" + queryFormat + "&query-default-output-format=" + outputFormat + qLabel + qDesc + contactid + qContext + expiration, templateBody, {headers: this.httpHeadersXML});
    } else {
      const templateBody ="<request><query>" + query + "</query></request>"
      return this.http.post<QueryResponse>(this.getExporterURL() + "/create-query?query-format=" + queryFormat + "&query-default-output-format=" + outputFormat + "&query-default-template-id=" + templateID + qLabel + qDesc + contactid + qContext + expiration, templateBody, {headers: this.httpHeadersXML});
    }
  }
  public generateExport(query: string, queryLabel: string, queryDescription: string, queryFormat: string, outputFormat: string, templateID: string, context: string, template?:string): Observable<ExportResponse> {
    let qLabel: string = "";
    let qDesc: string = "";
    let qContext: string = "";
    if (queryLabel && queryLabel !== "") { qLabel = "&query-label=" + queryLabel}
    if (queryDescription && queryDescription !== "") { qDesc = "&query-description=" + queryDescription}
    if (context && context.length !== 0) { qContext = "&query-context=" + context}
    if (templateID === "custom") {
      const templateBody ="<request><query>" + query + "</query>" + template + "</request>"
      return this.http.post<ExportResponse>(this.getExporterURL()+"/request?query-format=" + queryFormat + "&output-format=" + outputFormat + qLabel + qDesc + qContext, templateBody, {headers: this.httpHeadersXML});
    } else {
      const templateBody ="<request><query>" + query + "</query></request>"
      return this.http.post<ExportResponse>(this.getExporterURL() + "/request?query-format=" + queryFormat + "&output-format=" + outputFormat + "&template-id=" + templateID + qLabel + qDesc + qContext, templateBody, {headers: this.httpHeadersXML});
    }
  }
public executeQuery(queryID: string, outputFormat: string, templateID: string, template?:string ): Observable<ExportResponse> {
  if (templateID === "custom") {
    const templateBody ="<request>" + template + "</request>"
    return this.http.post<ExportResponse>(this.getExporterURL()+"/request?query-id="+ queryID + "&output-format=" + outputFormat, templateBody, {headers: this.httpHeadersXML});
  } else {
    return this.http.post<ExportResponse>(this.getExporterURL() + "/request?query-id="+ queryID + "&output-format=" + outputFormat + "&template-id=" + templateID, null, {headers: this.httpHeadersXML});
  }
}

  public updateQuery(queryID: string, query: string, queryLabel: string, queryDescription: string, outputFormat: string, templateID: string, context: string, expDate: string, template?:string): Observable<any> {
    let qLabel: string = "";
    let qDesc: string = "";
    let qContext: string = "";
    let expiration: string = "";
    if (queryLabel && queryLabel !== "") { qLabel = "&query-label=" + queryLabel }
    if (queryDescription && queryDescription !== "") { qDesc = "&query-description=" + queryDescription }
    if (context && context.length !== 0) { qContext = "&query-context=" + context}
    if (expDate.length > 0) { expiration = "&query-expiration-date=" + expDate }
    if (templateID === "custom") {
      const templateBody ="<request><query>" + query + "</query>" + template + "</request>"
      return this.http.post<QueryResponse>(this.getExporterURL() + "/update-query?query-id=" + queryID + "&query-default-output-format=" + outputFormat + qLabel + qDesc + qContext + expiration, templateBody, {headers: this.httpHeadersXML});
    } else {
      const templateBody ="<request><query>" + query + "</query></request>"
      return this.http.post<QueryResponse>(this.getExporterURL() + "/update-query?query-id=" + queryID + "&query-default-output-format=" + outputFormat + "&query-default-template-id=" + templateID + qLabel + qDesc + qContext + expiration, templateBody, {headers: this.httpHeadersXML});
    }
  }

  getExportStatus(exexID: string): Observable<ExportStatus> {
    return this.http.get<ExportStatus>(this.getExporterURL()+"/status?query-execution-id=" + exexID ,{headers: this.httpHeaders});
  }
  public fetchLogs(logSize: number, lastLineRep?: string, lastLineExp?: string): Observable<string[]> {
    return this.http.get<string[]>(this.getExporterURL()+"/logs?logs-size=" + logSize ,{headers: this.httpHeaders});
  }
  getExporterURL(): string | undefined {
    return this.backendUrl;
  }

  getExecutionRouterLink(id: string): string {
    return '/' + createRouterLinkForBase(EmbeddedTeilerApps.EXECUTION + '/' + id);
  }
}
