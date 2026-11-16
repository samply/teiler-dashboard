import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { AppComponent } from './app.component';
import { RouteManagerService } from './route/route-manager.service';
import { TeilerAuthService } from './security/teiler-auth.service';
import { StylingService } from './styling.service';
import { DashboardConfigService } from './teiler/dashboard-config.service';
import { spyService } from '../testing/spy-service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: RouteManagerService, useValue: { mainRouterLink: 'main', loginRouterLink: 'login', logoutRouterLink: 'logout' } },
        { provide: TeilerAuthService, useValue: spyService<TeilerAuthService>('TeilerAuthService', ['loadUserProfile', 'logout']) },
        { provide: OidcSecurityService, useValue: spyService<OidcSecurityService>('OidcSecurityService', ['checkAuth'], { checkAuth: of({ isAuthenticated: false }) }) },
        { provide: StylingService, useValue: spyService<StylingService>('StylingService', ['getPalettesLoadedStatus', 'getSelectedPaletteName'], { getPalettesLoadedStatus: new BehaviorSubject(false) }) },
        { provide: DashboardConfigService, useValue: spyService<DashboardConfigService>('DashboardConfigService', ['getConfig', 'getStyle'], { getConfig: of({ LOGO_TEXT: 'My Bridgehead' }) }) },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it(`should have as title 'teiler-dashboard'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance.title).toEqual('teiler-dashboard');
  });

  it('should render the logo text from the dashboard config', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.logo-text')?.textContent).toContain('My Bridgehead');
  });
});
