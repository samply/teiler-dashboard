import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { of } from 'rxjs';

import { QueryFormComponent } from './query-form.component';
import { buildEmptyQueryBox } from '../../exporter.component';
import { ExporterService } from '../../../../teiler/exporter.service';

describe('QueryFormComponent', () => {
  let component: QueryFormComponent;
  let fixture: ComponentFixture<QueryFormComponent>;
  let exporterServiceSpy: jasmine.SpyObj<ExporterService>;

  beforeEach(async () => {
    exporterServiceSpy = jasmine.createSpyObj<ExporterService>('ExporterService', ['getExporterURL', 'getOutputFormats', 'getQueryFormats', 'getExporterTemplates']);
    exporterServiceSpy.getExporterURL.and.returnValue('http://localhost/exporter');
    exporterServiceSpy.getOutputFormats.and.returnValue(of([]));
    exporterServiceSpy.getQueryFormats.and.returnValue(of([]));
    exporterServiceSpy.getExporterTemplates.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [QueryFormComponent],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TextFieldModule,
        NoopAnimationsModule,
        MatButtonModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatNativeDateModule,
        MatStepperModule,
        MatTooltipModule
      ],
      providers: [
        { provide: ExporterService, useValue: exporterServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueryFormComponent);
    component = fixture.componentInstance;
    component.element = buildEmptyQueryBox('contact-1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load output formats, query formats and templates on init', () => {
    expect(exporterServiceSpy.getOutputFormats).toHaveBeenCalled();
    expect(exporterServiceSpy.getQueryFormats).toHaveBeenCalled();
    expect(exporterServiceSpy.getExporterTemplates).toHaveBeenCalled();
  });

  it('should disable the save button until title, query and description are filled in', () => {
    component.element.label = '';
    component.element.query = '';
    component.element.description = '';
    component.generateButtonStatus();
    expect(component.buttonDisabled).toBeTrue();

    component.element.label = 'Titel';
    component.element.query = 'Anfrage';
    component.element.description = 'Beschreibung';
    component.generateButtonStatus();
    expect(component.buttonDisabled).toBeFalse();
  });
});
