import { authGuard } from './auth.guard';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

describe('authGuard', () => {
  let oidcSecurityServiceSpy: jasmine.SpyObj<OidcSecurityService>;

  beforeEach(() => {
    oidcSecurityServiceSpy = jasmine.createSpyObj('OidcSecurityService', ['authorize'], {
      isAuthenticated$: of(true), // ✅ Mocked observable
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: OidcSecurityService, useValue: oidcSecurityServiceSpy },
      ],
    });
  });

  it('should return true when user is authenticated', async () => {
    const result = await authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    expect(result).toBeTrue();
  });
});
