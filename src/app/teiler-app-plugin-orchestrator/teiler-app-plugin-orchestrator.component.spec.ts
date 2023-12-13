import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeilerAppPluginOrchestratorComponent } from './teiler-app-plugin-orchestrator.component';

describe('TeilerAppPluginOrchestratorComponent', () => {
  let component: TeilerAppPluginOrchestratorComponent;
  let fixture: ComponentFixture<TeilerAppPluginOrchestratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeilerAppPluginOrchestratorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeilerAppPluginOrchestratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
