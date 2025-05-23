import {Injectable} from '@angular/core';
import {EmbeddedTeilerApp, EmbeddedTeilerApps, TeilerRole} from "./teiler-app";
import {Router} from "@angular/router";
import {Observable, of} from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {environment} from "../../environments/environment";
import {QBResponse, QBStatus, QualityReports} from "../embedded/quality-report/quality-report.component";

export interface reportLog {
  source: string,
  lastLines: String[]
}

@Injectable({
  providedIn: 'root'
})
export class QualityReportService extends EmbeddedTeilerApp {

  description: string = $localize`Nutzen Sie den Reporter, um detaillierte Berichte sowie spezifizierte Qualitätsreports zu erstellen.`;
  iconClass: string = "bi bi-file-earmark-excel-fill";
  iconSourceUrl: string | undefined = undefined;
  title: string = $localize`Reporter`;
  roles: TeilerRole[] = [TeilerRole.TEILER_ADMIN];
  httpHeaders: HttpHeaders = new HttpHeaders();
  httpHeadersXML: HttpHeaders = new HttpHeaders().append("Content-Type",  "application/xml");
  constructor(router: Router, private http: HttpClient) {
    super(EmbeddedTeilerApps.QUALITY_REPORT, router);
  }

  public generateQB(templateID: string, template?:string): Observable<QBResponse> {
    if (templateID === "custom") {
      return this.http.post<QBResponse>(this.getReporterURL()+"/generate", template, {headers: this.httpHeadersXML});
    } else {
      return this.http.post<QBResponse>(this.getReporterURL() + "/generate?template-id=" + templateID, null, {headers: this.httpHeaders});
    }
  }
  public fetchLogs(logSize: number, lastLineRep?: string, lastLineExp?: string): Observable<reportLog[]> {
    const mock = [
      {
        "source": "reporter",
        "lastLines": [
          "Sending request to exporter...",
          "Response URL: http://localhost:8095/report?report-id=GbYpfophYqcysQa",
          "Fetching export... (Attempt: 1)",
          "Fetching export... (Attempt: 2)",
          "Fetching export... (Attempt: 3)",
          "Fetching export... (Attempt: 4)",
          "Fetching export... (Attempt: 5)",
          "Fetching export... (Attempt: 6)",
          "Fetching export... (Attempt: 7)",
          "Fetching export... (Attempt: 8)",
          "Fetching export... (Attempt: 9)",
          "Fetching export... (Attempt: 10)",
          "Fetching export... (Attempt: 11)",
          "Fetching export... (Attempt: 12)",
          "Sending request to exporter...",
          "Response URL: http://localhost:8095/report?report-id=VGIQaAnEvmeDJcG",
          "Fetching export... (Attempt: 1)",
          "Random Number: " + Math.floor(Math.random() * 10000000)
        ]
      },
      {
        "source": "exporter",
        "lastLines": [
          "Response URL: http://exporter:8092/response?query-execution-id=6",
          "Fetching first bundle...",
          "Random Number: " + Math.floor(Math.random() * 10000000)
        ]
      }
    ];
    //return of(mock);
    return this.http.get<reportLog[]>(this.getReporterURL()+"/logs?logs-size=" + logSize );
  }
  getReportStatus(reportID: string): Observable<QBStatus> {
    return this.http.get<QBStatus>(this.getReporterURL()+"/report-status?report-id=" + reportID );
  }

  getReports(): Observable<QualityReports[]> {
    return this.http.get<QualityReports[]>(this.getReporterURL()+"/reports-list" );
  }
  getReporterURL(): string | undefined {
    return this.backendUrl;
  }
  getRunningReports(): Observable<QualityReports[]> {
    return this.http.get<QualityReports[]>(this.getReporterURL()+"/running-reports" );
  }
  getReportTemplates(): Observable<string[]> {
    return this.http.get<string[]>(this.getReporterURL() + "/report-template-ids");
  }
}
