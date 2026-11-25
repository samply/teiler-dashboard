import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { QualityReportComponent } from './quality-report.component';
import { QualityReportService } from '../../teiler/quality-report.service';
import { spyService } from '../../../testing/spy-service';

describe('QualityReportComponent', () => {
  let component: QualityReportComponent;
  let fixture: ComponentFixture<QualityReportComponent>;
  let qualityReportService: jasmine.SpyObj<QualityReportService>;

  beforeEach(async () => {
    qualityReportService = spyService<QualityReportService>('QualityReportService',
      ['getReporterURL', 'getReportTemplates', 'getReports', 'getRunningReports', 'generateQB', 'getReportStatus', 'fetchLogs'],
      { getReporterURL: 'http://reporter' });

    await TestBed.configureTestingModule({
      declarations: [QualityReportComponent],
      imports: [MatTableModule, MatPaginatorModule, MatSortModule],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({}) } },
        { provide: QualityReportService, useValue: qualityReportService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(QualityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load templates, reports and running reports on init', () => {
    expect(qualityReportService.getReportTemplates).toHaveBeenCalled();
    expect(qualityReportService.getReports).toHaveBeenCalled();
    expect(qualityReportService.getRunningReports).toHaveBeenCalled();
  });
});
