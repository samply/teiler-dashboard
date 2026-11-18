import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { TeilerMainMenuComponent } from './teiler-main-menu.component';
import { TeilerService } from '../teiler/teiler.service';
import { TeilerAuthService } from '../security/teiler-auth.service';
import { TeilerApp } from '../teiler/teiler-app';

describe('TeilerMainMenuComponent', () => {
  let component: TeilerMainMenuComponent;
  let fixture: ComponentFixture<TeilerMainMenuComponent>;
  let teilerService: { teilerApps: TeilerApp[] };

  beforeEach(async () => {
    teilerService = { teilerApps: [] };
    await TestBed.configureTestingModule({
      declarations: [TeilerMainMenuComponent],
      providers: [
        provideRouter([]),
        { provide: TeilerService, useValue: teilerService },
        { provide: TeilerAuthService, useValue: { isLoggedId: () => of(true) } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TeilerMainMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.isLoggedIn).toBeTrue();
  });

  it('should detect local and central apps at the same time', () => {
    teilerService.teilerApps = [{ local: true } as TeilerApp, { local: true } as TeilerApp];
    expect(component.existLocalAndCentralTeilerAppsAtTheSameTime()).toBeFalse();
    teilerService.teilerApps = [{ local: true } as TeilerApp, { local: false } as TeilerApp];
    expect(component.existLocalAndCentralTeilerAppsAtTheSameTime()).toBeTrue();
  });
});
