import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { of } from 'rxjs';

import { ExecutionComponent } from './execution.component';
import { ExecutionService } from '../../teiler/execution.service';
import { ExporterService } from '../../teiler/exporter.service';
import { ExporterQueries } from '../exporter/exporter.component';

describe('ExecutionComponent', () => {
  let component: ExecutionComponent;
  let fixture: ComponentFixture<ExecutionComponent>;
  let executionServiceSpy: jasmine.SpyObj<ExecutionService>;
  let exporterServiceSpy: jasmine.SpyObj<ExporterService>;

  beforeEach(async () => {
    executionServiceSpy = jasmine.createSpyObj<ExecutionService>('ExecutionService', ['getQuery', 'getExecutionList']);
    executionServiceSpy.getQuery.and.returnValue(of({
      id: 1,
      query: '',
      format: 'FHIR_SEARCH',
      label: '',
      description: '',
      contactId: '',
      expirationDate: null as unknown as string,
      createdAt: '',
      archivedAt: '',
      context: null as unknown as string,
      defaultTemplateId: null as unknown as string,
      defaultOutputFormat: null as unknown as string
    } as ExporterQueries));
    executionServiceSpy.getExecutionList.and.returnValue(of([]));

    exporterServiceSpy = jasmine.createSpyObj<ExporterService>('ExporterService', ['getExporterURL', 'getOutputFormats', 'getQueryFormats', 'getExporterTemplates']);
    exporterServiceSpy.getExporterURL.and.returnValue('http://localhost/exporter');
    exporterServiceSpy.getOutputFormats.and.returnValue(of([]));
    exporterServiceSpy.getQueryFormats.and.returnValue(of([]));
    exporterServiceSpy.getExporterTemplates.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [ExecutionComponent],
      imports: [
        CommonModule,
        FormsModule,
        NoopAnimationsModule,
        MatButtonModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatTableModule
      ],
      providers: [
        { provide: ExecutionService, useValue: executionServiceSpy },
        { provide: ExporterService, useValue: exporterServiceSpy },
        { provide: ActivatedRoute, useValue: { params: of({ id: '1' }) } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
