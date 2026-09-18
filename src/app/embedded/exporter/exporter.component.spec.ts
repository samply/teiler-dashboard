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
import { of } from 'rxjs';

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
});
