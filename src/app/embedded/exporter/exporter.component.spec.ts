import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewportScroller } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { of, Subject } from 'rxjs';

import { ExporterComponent, ExporterQueries } from './exporter.component';
import { ExporterService } from '../../teiler/exporter.service';
import { ExecutionService } from '../../teiler/execution.service';
import { TeilerAuthService } from '../../security/teiler-auth.service';

describe('ExporterComponent', () => {
  let component: ExporterComponent;
  let fixture: ComponentFixture<ExporterComponent>;
  let exporterServiceSpy: jasmine.SpyObj<ExporterService>;
  let executionServiceSpy: jasmine.SpyObj<ExecutionService>;

  beforeEach(async () => {
    exporterServiceSpy = jasmine.createSpyObj<ExporterService>('ExporterService', ['getExporterURL', 'getReports']);
    exporterServiceSpy.getExporterURL.and.returnValue('http://localhost/exporter');
    exporterServiceSpy.getReports.and.returnValue(of([] as ExporterQueries[]));

    executionServiceSpy = jasmine.createSpyObj<ExecutionService>('ExecutionService', ['getExecutionList']);
    executionServiceSpy.getExecutionList.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [ExporterComponent],
      imports: [
        CommonModule,
        FormsModule,
        NoopAnimationsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatPaginatorModule,
        MatTableModule
      ],
      providers: [
        { provide: ExporterService, useValue: exporterServiceSpy },
        { provide: ExecutionService, useValue: executionServiceSpy },
        { provide: TeilerAuthService, useValue: jasmine.createSpyObj<TeilerAuthService>('TeilerAuthService', ['loadUserProfile', 'isLoggedId', 'getRoles', 'getGroups']) },
        { provide: ViewportScroller, useValue: jasmine.createSpyObj<ViewportScroller>('ViewportScroller', ['scrollToPosition']) }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reload the queries and keep the selection on the affected query after a request in the dialog', () => {
    const queries = [
      { id: 1, label: 'A', createdAt: '2026-01-01', context: null },
      { id: 2, label: 'B', createdAt: '2026-02-01', context: null }
    ] as unknown as ExporterQueries[];
    exporterServiceSpy.getReports.and.returnValue(of(queries));

    const dataChanged = new Subject<string | undefined>();
    const afterClosed = new Subject<boolean>();
    spyOn(component.dialog, 'open').and.returnValue({
      componentInstance: { dataChanged },
      afterClosed: () => afterClosed
    } as any);

    component.editDialog({} as any, 'edit');
    exporterServiceSpy.getReports.calls.reset();
    executionServiceSpy.getExecutionList.calls.reset();

    dataChanged.next('1');
    expect(exporterServiceSpy.getReports).toHaveBeenCalledTimes(1);
    expect(component.dataSource.data[component.activeDataSource].id).toBe(1);
    expect(executionServiceSpy.getExecutionList).toHaveBeenCalledWith(1);

    afterClosed.next(false);
    expect(exporterServiceSpy.getReports).toHaveBeenCalledTimes(2);
  });

  it('should highlight only the selected query in the overview', () => {
    const queries = [
      { id: 1, label: 'A', createdAt: '2026-01-01', context: null },
      { id: 2, label: 'B', createdAt: '2026-02-01', context: null }
    ] as unknown as ExporterQueries[];
    exporterServiceSpy.getReports.and.returnValue(of(queries));
    component.getQueries();
    fixture.detectChanges();

    const secondRow = fixture.nativeElement.querySelectorAll('.info-box-table tr.mat-mdc-row')[1] as HTMLElement;
    secondRow.click();
    fixture.detectChanges();

    const selectedRows = fixture.nativeElement.querySelectorAll('.info-box-table tr.selected-row');
    expect(selectedRows.length).toBe(1);
    expect(selectedRows[0]).toBe(secondRow);
  });

  it('should paginate the execution logs only when there are more than 5', () => {
    const executions = (count: number) => Array.from({length: count}, (_, i) => ({
      id: i + 1, queryId: 1, templateId: 't', outputFormat: 'EXCEL', status: 'OK', executedAt: `2026-01-${String(i + 1).padStart(2, '0')}`
    })) as any;

    executionServiceSpy.getExecutionList.and.returnValue(of(executions(5)));
    component.getQueryExecutions(1);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.execution-row').length).toBe(5);
    expect(fixture.nativeElement.querySelector('.execution-paginator')).toBeNull();

    executionServiceSpy.getExecutionList.and.returnValue(of(executions(12)));
    component.getQueryExecutions(1);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.execution-row').length).toBe(5);
    expect(fixture.nativeElement.querySelector('.execution-paginator')).not.toBeNull();

    component.onExecutionPage({pageIndex: 2, pageSize: 5, length: 12});
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.execution-row').length).toBe(2);
  });
});
