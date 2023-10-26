import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ExecutionService} from "../../teiler/execution.service";
import {Subscription} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";

export interface ExporterExecutions {
  id: number;
  queryId: number;
  templateId: string;
  outputFormat: string;
  status: string;
  executedAt: string;
}

@Component({
  selector: 'execution',
  templateUrl: './execution.component.html',
  styleUrls: ['./execution.component.css']
})
export class ExecutionComponent implements OnInit, OnDestroy {
  displayedColumnsExecutions: string[] = ['executedAt', 'status', 'templateId', 'outputFormat'];
  displayedColumnsPatients: string[] = ['Patient-ID', 'Geschlecht', 'Geburtsdatum', 'Vitalstatus'];
  dataSourceExecutions = new MatTableDataSource<ExporterExecutions>();
  dataSourcePatients = new MatTableDataSource()
  private subscriptionGetExecutionList: Subscription | undefined
  private subscriptionGetExecution: Subscription | undefined
  queryID: number = 0;
  constructor(private route: ActivatedRoute, private executionService: ExecutionService) {}

  // @ts-ignore
  @ViewChild('paginator') paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSourceExecutions.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.queryID = params['id'];
      console.log(params['id'])
      this.getQueryExecutions();
    })
    console.log(this.dataSourcePatients.data)
  }
  ngOnDestroy(): void {
    this.subscriptionGetExecutionList?.unsubscribe();
    this.subscriptionGetExecution?.unsubscribe();
  }

  getQueryExecutions(): void {
    this.subscriptionGetExecutionList?.unsubscribe();
    this.subscriptionGetExecutionList = this.executionService.getExecutionList().subscribe({
      next: (execs) => {
        const tempExecs: ExporterExecutions[] = [];
        execs.forEach((execution) => {
          if (execution.queryId == this.queryID) {
            tempExecs.push({
              id: execution.id,
              queryId: execution.queryId,
              templateId: execution.templateId,
              outputFormat: execution.outputFormat,
              status: execution.status,
              executedAt: this.transformDate(execution.executedAt)
            })
            tempExecs.sort((a,b) =>  Number(b.executedAt) - Number(a.executedAt))
            this.dataSourceExecutions.data = tempExecs;
            this.dataSourceExecutions._updateChangeSubscription();
            console.log(this.dataSourceExecutions.data)
          }
        })
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
      }
    })
  }

  openExecution(exec:ExporterExecutions): void {
    this.subscriptionGetExecution?.unsubscribe();
    this.subscriptionGetExecution = this.executionService.getExecutionData(exec.id).subscribe({
      next: (data) => {

            this.dataSourcePatients.data = data[0].Patients;
            this.dataSourcePatients._updateChangeSubscription();
            console.log(data)

      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
      }
    })
    console.log(exec)
  }

  transformDate(date: string): string {
    return new Date(date).getTime().toString();
  }
}
