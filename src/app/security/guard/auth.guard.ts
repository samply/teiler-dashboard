import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const oidcSecurityService = inject(OidcSecurityService);

  return oidcSecurityService.isAuthenticated$.pipe(
    map(({ isAuthenticated }) => {
      if (!isAuthenticated) {
        oidcSecurityService.authorize();
        return false;
      }
      return true;
    })
  );
};
