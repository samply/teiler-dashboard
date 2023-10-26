import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {ExporterService} from "../../teiler/exporter.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {EmbeddedTeilerApps} from "../../teiler/teiler-app";

export interface ExporterQueries {
  id: number;
  query: string;
  format: string;
  label: string;
  description: string;
  contactId: string;
  expirationDate: string;
  createdAt: string;
  archivedAt: string;
}
@Component({
  selector: 'exporter',
  templateUrl: './exporter.component.html',
  styleUrls: ['./exporter.component.css']
})
export class ExporterComponent implements OnInit, OnDestroy {

  private subscriptionGetQueries: Subscription | undefined
  displayedColumns: string[] = ['timestamp', 'querysource', 'format'];
  dataSource = new MatTableDataSource<ExporterQueries>();
  clickedRows = new Set<ExporterQueries>();

  constructor(private exporterService: ExporterService, private router: Router) {
  }
  // @ts-ignore
  @ViewChild('paginator') paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    this.getReports();
  }

  ngOnDestroy(): void {
    this.subscriptionGetQueries?.unsubscribe();
  }

  getReports(): void {
    this.subscriptionGetQueries?.unsubscribe();
    this.subscriptionGetQueries = this.exporterService.getReports().subscribe({
      next: (queryList:ExporterQueries[]) => {
        console.log(queryList)
        const tempEQs: ExporterQueries[] = [];
        queryList.forEach((query) => {
          tempEQs.push({id: query.id, query: query.query, format: query.format, label: query.label, description: query.description, contactId: query.contactId, expirationDate: query.expirationDate, createdAt: this.transformDate(query.createdAt), archivedAt: query.archivedAt})
        })
        tempEQs.sort((a,b) =>  Number(b.createdAt) - Number(a.createdAt))
        this.dataSource.data = tempEQs;
        this.dataSource._updateChangeSubscription();
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {}
    })
  }

  openQuery(query:ExporterQueries): void {
    console.log(query)
    this.router.navigate([EmbeddedTeilerApps.EXECUTION, query.id])
  }
  transformDate(date: string): string {
    return new Date(date).getTime().toString();
  }

}
