import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { of } from 'rxjs';
import { ExporterComponent } from './exporter.component';
import { ExporterService } from '../../teiler/exporter.service';
import { TeilerAuthService } from '../../security/teiler-auth.service';
import { spyService } from '../../../testing/spy-service';

describe('ExporterComponent', () => {
  let component: ExporterComponent;
  let fixture: ComponentFixture<ExporterComponent>;
  let exporterService: jasmine.SpyObj<ExporterService>;

  beforeEach(async () => {
    exporterService = spyService<ExporterService>('ExporterService',
      ['getExporterURL', 'getReports', 'getExporterTemplates', 'getOutputFormats', 'getQueryFormats',
        'generateExport', 'getExportStatus', 'fetchLogs', 'createQuery', 'updateQuery', 'executeQuery'],
      { getExporterURL: 'http://exporter' });
    const authService = spyService<TeilerAuthService>('TeilerAuthService', ['loadUserProfile'],
      { loadUserProfile: of({ email: 'user@example.org' }) });

    await TestBed.configureTestingModule({
      declarations: [ExporterComponent],
      imports: [MatMenuModule, MatTableModule, MatPaginatorModule, MatSortModule],
      providers: [
        provideRouter([]),
        { provide: ExporterService, useValue: exporterService },
        { provide: TeilerAuthService, useValue: authService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ExporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load queries, templates and formats on init', () => {
    expect(exporterService.getReports).toHaveBeenCalled();
    expect(exporterService.getExporterTemplates).toHaveBeenCalled();
    expect(exporterService.getOutputFormats).toHaveBeenCalled();
    expect(exporterService.getQueryFormats).toHaveBeenCalled();
  });

  it('should use the e-mail of the logged-in user as contact id', () => {
    expect(component.contactID).toBe('user@example.org');
  });
});
