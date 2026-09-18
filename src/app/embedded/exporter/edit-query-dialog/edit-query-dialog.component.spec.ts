import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { of } from 'rxjs';

import { EditQueryDialogComponent, EditQueryDialogData } from './edit-query-dialog.component';
import { QueryFormComponent } from './query-form/query-form.component';
import { buildEmptyQueryBox } from '../exporter.component';
import { ExporterService } from '../../../teiler/exporter.service';
import { ExecutionService } from '../../../teiler/execution.service';

describe('EditQueryDialogComponent', () => {
  let component: EditQueryDialogComponent;
  let fixture: ComponentFixture<EditQueryDialogComponent>;
  let exporterServiceSpy: jasmine.SpyObj<ExporterService>;
  let executionServiceSpy: jasmine.SpyObj<ExecutionService>;

  const dialogData: EditQueryDialogData = {
    target: 'edit',
    element: buildEmptyQueryBox('contact-1')
  };

  beforeEach(async () => {
    exporterServiceSpy = jasmine.createSpyObj<ExporterService>('ExporterService', ['getExporterURL', 'getOutputFormats', 'getQueryFormats', 'getExporterTemplates']);
    exporterServiceSpy.getExporterURL.and.returnValue('http://localhost/exporter');
    exporterServiceSpy.getOutputFormats.and.returnValue(of([]));
    exporterServiceSpy.getQueryFormats.and.returnValue(of([]));
    exporterServiceSpy.getExporterTemplates.and.returnValue(of([]));

    executionServiceSpy = jasmine.createSpyObj<ExecutionService>('ExecutionService', ['getExecutionList']);
    executionServiceSpy.getExecutionList.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [EditQueryDialogComponent, QueryFormComponent],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatButtonModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatNativeDateModule,
        MatStepperModule,
        MatTabsModule,
        MatTooltipModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
        { provide: MatDialogRef, useValue: jasmine.createSpyObj<MatDialogRef<EditQueryDialogComponent, boolean>>('MatDialogRef', ['close']) },
        { provide: ExporterService, useValue: exporterServiceSpy },
        { provide: ExecutionService, useValue: executionServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditQueryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
