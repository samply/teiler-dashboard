import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ExecutionComponent } from './execution.component';
import { ExecutionService } from '../../teiler/execution.service';
import { ExporterService } from '../../teiler/exporter.service';
import { spyService } from '../../../testing/spy-service';

describe('ExecutionComponent', () => {
  let component: ExecutionComponent;
  let fixture: ComponentFixture<ExecutionComponent>;
  let executionService: jasmine.SpyObj<ExecutionService>;

  beforeEach(async () => {
    window.history.replaceState({}, '');
    executionService = spyService<ExecutionService>('ExecutionService',
      ['getExecutionList', 'getQuery', 'getTemplateGraph', 'getExecutionDataInBody', 'getExecutionError']);
    const exporterService = spyService<ExporterService>('ExporterService',
      ['getExporterURL', 'getExporterTemplates', 'getOutputFormats', 'getQueryFormats', 'getExportStatus', 'fetchLogs', 'executeQuery'],
      { getExporterURL: 'http://exporter' });

    await TestBed.configureTestingModule({
      declarations: [ExecutionComponent],
      imports: [MatTableModule, MatPaginatorModule, MatSortModule],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({ id: '42' }) } },
        { provide: ExecutionService, useValue: executionService },
        { provide: ExporterService, useValue: exporterService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ExecutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the query and its executions for the id from the route', () => {
    expect(String(component.queryID)).toBe('42');
    expect(executionService.getQuery).toHaveBeenCalled();
    expect(executionService.getExecutionList).toHaveBeenCalled();
  });
});
