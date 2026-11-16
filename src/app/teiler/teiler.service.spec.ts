import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TeilerService } from './teiler.service';
import { TeilerAuthService } from '../security/teiler-auth.service';
import { QualityReportService } from './quality-report.service';
import { ExporterService } from './exporter.service';
import { ExecutionService } from './execution.service';
import { TeilerApp, TeilerRole } from './teiler-app';
import { environment } from '../../environments/environment';

describe('TeilerService', () => {
  let service: TeilerService;
  let authService: jasmine.SpyObj<TeilerAuthService>;
  const originalConfig = { ...environment.config };

  const app = (name: string, roles: TeilerRole[], extra: Partial<TeilerApp> = {}) =>
    ({ name, roles, activated: true, ...extra }) as TeilerApp;

  beforeEach(() => {
    authService = jasmine.createSpyObj<TeilerAuthService>('TeilerAuthService', ['getRoles', 'getGroups']);
    TestBed.configureTestingModule({
      providers: [
        TeilerService,
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TeilerAuthService, useValue: authService },
        { provide: QualityReportService, useValue: app('quality-report', []) },
        { provide: ExporterService, useValue: app('exporter', []) },
        { provide: ExecutionService, useValue: app('execution', []) },
      ],
    });
    service = TestBed.inject(TeilerService);
    environment.config.TEILER_USER = 'bh-user';
    environment.config.TEILER_ADMIN = 'bh-admin';
    environment.config.OIDC_TOKEN_GROUP = '';
  });

  afterEach(() => Object.assign(environment.config, originalConfig));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should authorize apps without roles or with TEILER_PUBLIC without asking for user roles', async () => {
    expect(await service.isAuthorized(app('a', []))).toBeTrue();
    expect(await service.isAuthorized(app('b', [TeilerRole.TEILER_PUBLIC]))).toBeTrue();
    expect(authService.getRoles).not.toHaveBeenCalled();
  });

  it('should map the user roles from the token to teiler roles', async () => {
    authService.getRoles.and.resolveTo(['bh-user']);
    expect(await service.isAuthorized(app('a', [TeilerRole.TEILER_USER]))).toBeTrue();
    expect(await service.isAuthorized(app('b', [TeilerRole.TEILER_ADMIN]))).toBeFalse();
  });

  it('should use the groups claim when OIDC_TOKEN_GROUP is configured', async () => {
    environment.config.OIDC_TOKEN_GROUP = 'groups';
    authService.getGroups.and.resolveTo(['bh-admin']);
    expect(await service.isAuthorized(app('a', [TeilerRole.TEILER_ADMIN]))).toBeTrue();
    expect(authService.getGroups).toHaveBeenCalled();
    expect(authService.getRoles).not.toHaveBeenCalled();
  });

  it('should merge backend apps into embedded apps with the same name and add new ones', () => {
    const embedded = app('exporter', [], { order: 1 } as Partial<TeilerApp>);
    service.allTeilerApps = [embedded];
    service.addTeilerDashboardApps([
      app('exporter', [TeilerRole.TEILER_USER], { activated: false }),
      app('plugin', []),
    ]);
    expect(service.allTeilerApps.length).toBe(2);
    expect(embedded.activated).toBeFalse();
    expect(embedded.roles).toEqual([TeilerRole.TEILER_USER]);
  });

  it('should only keep activated and authorized apps', async () => {
    service.allTeilerApps = [app('a', []), app('b', [], { activated: false })];
    await service.filterTeilerApps();
    expect(service.teilerApps.map(a => a.name)).toEqual(['a']);
  });
});
