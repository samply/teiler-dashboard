import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TeilerAppPluginOrchestratorComponent } from './teiler-app-plugin-orchestrator.component';
import { TeilerService } from '../teiler/teiler.service';

describe('TeilerAppPluginOrchestratorComponent', () => {
  let component: TeilerAppPluginOrchestratorComponent;
  let fixture: ComponentFixture<TeilerAppPluginOrchestratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeilerAppPluginOrchestratorComponent],
      providers: [
        provideRouter([]),
        { provide: TeilerService, useValue: { teilerApps: [] } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TeilerAppPluginOrchestratorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
