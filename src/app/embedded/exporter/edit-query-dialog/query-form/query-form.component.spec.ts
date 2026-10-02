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
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';

import { QueryFormComponent } from './query-form.component';
import { buildEmptyQueryBox } from '../../exporter.component';
import { ExporterService } from '../../../../teiler/exporter.service';

describe('QueryFormComponent', () => {
  let component: QueryFormComponent;
  let fixture: ComponentFixture<QueryFormComponent>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let exporterServiceSpy: jasmine.SpyObj<ExporterService>;

  beforeEach(async () => {
    exporterServiceSpy = jasmine.createSpyObj<ExporterService>('ExporterService', ['getExporterURL', 'getOutputFormats', 'getQueryFormats', 'getExporterTemplates', 'updateQuery', 'createQuery']);
    exporterServiceSpy.getExporterURL.and.returnValue('http://localhost/exporter');
    exporterServiceSpy.getOutputFormats.and.returnValue(of([]));
    exporterServiceSpy.getQueryFormats.and.returnValue(of([]));
    exporterServiceSpy.getExporterTemplates.and.returnValue(of([]));

    snackBarSpy = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);

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
        { provide: ExporterService, useValue: exporterServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
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

  it('should show a success alert after an existing query was saved', () => {
    component.element.loadedQueryID = '42';
    exporterServiceSpy.updateQuery.and.returnValue(of({}));
    component.saveQuery();
    expect(snackBarSpy.open).toHaveBeenCalledWith(component.saveSuccessLoc, component.closeLoc, jasmine.objectContaining({panelClass: 'snackbar-success'}));
  });

  it('should show a success alert after a new query was created', () => {
    exporterServiceSpy.createQuery.and.returnValue(of({queryId: '7'} as any));
    component.saveQuery();
    expect(component.element.loadedQueryID).toBe('7');
    expect(snackBarSpy.open).toHaveBeenCalledWith(component.saveSuccessLoc, component.closeLoc, jasmine.objectContaining({panelClass: 'snackbar-success'}));
  });

  it('should show an error alert when saving fails', () => {
    component.element.loadedQueryID = '42';
    exporterServiceSpy.updateQuery.and.returnValue(throwError(() => new Error('500')));
    component.saveQuery();
    expect(snackBarSpy.open).toHaveBeenCalledWith(component.saveErrorLoc, component.closeLoc, jasmine.objectContaining({panelClass: 'snackbar-error'}));
  });
});
