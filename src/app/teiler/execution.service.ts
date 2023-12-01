import { Injectable } from '@angular/core';
import {EmbeddedTeilerApp, EmbeddedTeilerApps, TeilerRole} from "./teiler-app";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {ExporterExecutions} from "../embedded/execution/execution.component";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {ExporterQueries} from "../embedded/exporter/exporter.component";

@Injectable({
  providedIn: 'root'
})
export class ExecutionService extends EmbeddedTeilerApp {

  description: string = "";
  iconClass: string | undefined = 'bi bi-person-rolodex';
  iconSourceUrl: string | undefined = undefined;
  title: string = "Query Execution";
  roles: TeilerRole[] = [TeilerRole.TEILER_USER];
  httpHeaders: HttpHeaders = new HttpHeaders().append("x-api-key", environment.config.EXPORTER_API_KEY);

  routerLinkExtension: string = "/:id";

  constructor(router: Router, private http: HttpClient) {
    super(EmbeddedTeilerApps.EXECUTION, router);
  }

  getQuery(queryID: number): Observable<ExporterQueries> {
    return this.http.get<ExporterQueries>(this.getExporterURL()+"/queries?query-id=" + queryID ,{headers: this.httpHeaders});
  }
  getExecutionList(queryID?:number): Observable<ExporterExecutions[]> {
    if (queryID) {
      return this.http.get<ExporterExecutions[]>(this.getExporterURL() + "/query-executions?query-id=" + queryID, {headers: this.httpHeaders});
    } else {
      return this.http.get<ExporterExecutions[]>(this.getExporterURL() + "/query-executions", {headers: this.httpHeaders});
    }
  }
  getExecutionData(execID:number): Observable<any[]> {
    return this.http.get<any[]>(this.getExporterURL() + "/response?merge-files=true&in-body=true&query-execution-id=" + execID, {headers: this.httpHeaders});
  }
  getTemplateGraph(execID: number): Observable<any> {
    return this.http.get<any[]>(this.getExporterURL() + "/template-graph?query-execution-id=" + execID);
  }
  getExporterURL(): string | undefined {
    return this.backendUrl;
  }
}
