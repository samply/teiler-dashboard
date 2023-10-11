import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

import {DatePipe} from '@angular/common';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {QualityReportService, reportLog} from "../../teiler/quality-report.service";
import {Subscription} from "rxjs";

export interface QualityReports {
  id: string;
  path: string;
  timestamp: string;
  "template-id": string;
}

export interface QBResponse {
  responseUrl: URL;
}
export interface Templates {
  value: string;
  display: string
}
export enum QBStatus {
  OK = "OK",
  RUNNING = "RUNNING",
  NOT_FOUND = "NOT_FOUND",
  EMPTY = "EMPTY",
  ERROR = "ERROR"
}

@Component({
  selector: 'quality-report-app',
  templateUrl: './quality-report.component.html',
  styleUrls: ['./quality-report.component.css']
})


export class QualityReportComponent implements OnInit, OnDestroy {
  //table
  displayedColumns: string[] = ['timestamp', 'templateid', 'link'];
  dataSource = new MatTableDataSource<QualityReports>();

  //generator
  title = 'appComponent';

  private subscriptionGenerateQB: Subscription | undefined
  private subscriptionGetReports: Subscription | undefined
  private subscriptionGetReportStatus: Subscription | undefined
  private subscriptionFetchLogs: Subscription | undefined
  private subscriptionGetRunningReports: Subscription | undefined
  private subscriptionGetTemplateIDs: Subscription | undefined

  private intervall: number | undefined
  reportLog: reportLog[] = [];
  QBStatus: typeof QBStatus = QBStatus;
  qbStatus: QBStatus = QBStatus.EMPTY
  reportUrl = "";
  buttonDisabled: boolean = false;
  fileName: string | undefined;
  importTemplate: string = "";
  selectedTemplate: string = "ccp";
  templateIDs: Templates[] = []

  constructor(private route: ActivatedRoute, private qualityReportService: QualityReportService) {
  }
  // @ts-ignore
  @ViewChild('paginator') paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit() {
    this.reportUrl = this.qualityReportService.getReporterURL() + "/";
    this.getTemplateIDs();
    this.getReports();
    this.getRunningReports();
  }

  ngOnDestroy(): void {
    this.subscriptionGenerateQB?.unsubscribe();
    this.subscriptionGetReports?.unsubscribe();
    this.subscriptionGetReportStatus?.unsubscribe();
    this.subscriptionFetchLogs?.unsubscribe();
    this.subscriptionGetRunningReports?.unsubscribe();
    this.subscriptionGetTemplateIDs?.unsubscribe();
    window.clearInterval(this.intervall);
  }

  doImportFromFile(event: Event): void {
    // @ts-ignore
    const file: File = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = this.onReaderLoad.bind(this);
    reader.readAsText(file);
    this.fileName = file.name;
  }
  onReaderLoad(event: any): void {
    this.importTemplate = event.target.result;
    this.generateQB();
  }

  generateQB() {
    this.buttonDisabled = true;
    this.subscriptionGenerateQB = this.qualityReportService.generateQB(this.selectedTemplate, this.importTemplate).subscribe({
      next: (response:QBResponse) => {
        const url = new URL(response.responseUrl)
        const id = url.searchParams.get("report-id");
        this.qbStatus = QBStatus.RUNNING
        if (id) {
          this.pollingStatusAndLogs(id, false);
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {}
    });
  }

  getReports(): void {
    this.subscriptionGetReports?.unsubscribe();
    this.subscriptionGetReports = this.qualityReportService.getReports().subscribe({
      next: (reportList:QualityReports[]) => {
        const tempQBs: QualityReports[] = [];
        let tempID;
        reportList.forEach((report) => {
          report["template-id"] === "null" ? tempID = "unbekannt" : tempID = report["template-id"]
          tempQBs.push({id: report.id, path: report.path, timestamp: this.transformDate(report.timestamp), "template-id": tempID})
        })
        tempQBs.sort((a,b) =>  Number(b.timestamp) - Number(a.timestamp))
        this.dataSource.data = tempQBs;
        this.dataSource._updateChangeSubscription();
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {}
    })
  }

  pollingStatusAndLogs(id: string, init: boolean): void {
    this.subscriptionGenerateQB?.unsubscribe();
    this.subscriptionGetReportStatus?.unsubscribe();
    this.subscriptionFetchLogs?.unsubscribe();

    const reportDiv = document.getElementById("reportDiv");
    const exportDiv = document.getElementById("exportDiv");
    this.intervall = window.setInterval(() => {
      this.subscriptionGetReportStatus = this.qualityReportService.getReportStatus(id).subscribe({
        next: (status) => {
          console.log(status)
          if (!init || status !== QBStatus.OK) {this.qbStatus = status;}
          if (status !== QBStatus.RUNNING) {
            window.clearInterval(this.intervall);
            this.buttonDisabled = false;
            if (status === QBStatus.OK && !init) {
              this.reportLog = [];
              this.downloadReport(id);
              this.getReports();
            }
          }
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {}
      });
      if (this.qbStatus === QBStatus.RUNNING) {
        init = false;
        this.subscriptionFetchLogs = this.qualityReportService.fetchLogs(1000).subscribe({
          next: (response) => {
            this.reportLog = response;
            for (const repexpDiv of [reportDiv, exportDiv]) {
              this.scrollToEndOfLog(repexpDiv)
            }
          },
          error: (error) => {
            console.log(error);
          },
          complete: () => {
          }
        });
      }
    }, 2000)
  }

  downloadReport(id: string): void {
    window.location.href=this.reportUrl + 'report?report-id=' + id;
  }

  transformDate(dateLog: string): string {
    return new Date(dateLog.substring(0,4) + "-" + dateLog.substring(4,6) + "-" + dateLog.substring(6,8) + "T" + dateLog.substring(9,11) + ":" + dateLog.substring(12,14) + "+00:00").getTime().toString();
  }


  scrollToEndOfLog(element: HTMLElement | null): void {
    if (element) {
      const isScrolledToBottomReport = element.scrollHeight - element.clientHeight <= element.scrollTop + 1;
      setTimeout(function () {
        if (isScrolledToBottomReport) {
          element.scrollTop = element.scrollHeight - element.clientHeight;
        }
      }, 200);
    }
  }

  getRunningReports(): void {
    this.subscriptionGetRunningReports?.unsubscribe();
    this.subscriptionGetRunningReports = this.qualityReportService.getRunningReports().subscribe({
      next: (reportList:QualityReports[]) => {
        const tempQBs: QualityReports[] = []
        reportList.forEach((report) => {
          tempQBs.push({id: report.id, path: report.path, timestamp: this.transformDate(report.timestamp), "template-id": report["template-id"]})
        })
        tempQBs.sort((a,b) =>  Number(b.timestamp) - Number(a.timestamp))
        if (tempQBs.length > 0) {
          this.buttonDisabled = true;
          this.pollingStatusAndLogs(tempQBs[0].id, true)
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {}
    })
  }

  getTemplateIDs(): void {
    this.subscriptionGetTemplateIDs?.unsubscribe();
    this.subscriptionGetTemplateIDs = this.qualityReportService.getReportTemplates().subscribe({
      next: (templateList:string[]) => {
        templateList.forEach((template) => {
          this.templateIDs.push({value: template, display: template})
        })
        this.templateIDs.push({value: "custom", display:"Eigenes Template"})
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {}
    })
  }

  cancelQB(): void {
    window.clearInterval(this.intervall);
    this.buttonDisabled = false;
    this.qbStatus = QBStatus.EMPTY;
  }

  downloadTemplate(): void {
    window.location.href = this.reportUrl + 'report-template?template-id=' + this.selectedTemplate;
  }
}
