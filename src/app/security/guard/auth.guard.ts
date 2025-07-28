import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import {map, of} from 'rxjs';
import {environment} from "../../../environments/environment";

export const authGuard: CanActivateFn = (route, state) => {

  if (environment.config.OIDC_URL){
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

  } else {
    return of(false);
  }

};
