import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { firstValueFrom, Observable, of } from 'rxjs';
import { authGuard } from './auth.guard';
import { environment } from '../../../environments/environment';

describe('authGuard', () => {
  let oidcSecurityService: jasmine.SpyObj<OidcSecurityService>;
  const originalOidcUrl = environment.config.OIDC_URL;

  const runGuard = () => TestBed.runInInjectionContext(() =>
    firstValueFrom(authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot) as Observable<boolean>));

  const setup = (isAuthenticated: boolean) => {
    oidcSecurityService = jasmine.createSpyObj<OidcSecurityService>('OidcSecurityService', ['authorize'], {
      isAuthenticated$: of({ isAuthenticated, allConfigsAuthenticated: [] }),
    });
    TestBed.configureTestingModule({
      providers: [{ provide: OidcSecurityService, useValue: oidcSecurityService }],
    });
  };

  beforeEach(() => environment.config.OIDC_URL = 'https://sso.example.org');
  afterEach(() => environment.config.OIDC_URL = originalOidcUrl);

  it('should return true when user is authenticated', async () => {
    setup(true);
    expect(await runGuard()).toBeTrue();
    expect(oidcSecurityService.authorize).not.toHaveBeenCalled();
  });

  it('should start the login and return false when user is not authenticated', async () => {
    setup(false);
    expect(await runGuard()).toBeFalse();
    expect(oidcSecurityService.authorize).toHaveBeenCalled();
  });

  it('should return false when no OIDC provider is configured', async () => {
    setup(true);
    environment.config.OIDC_URL = '';
    expect(await runGuard()).toBeFalse();
  });
});
