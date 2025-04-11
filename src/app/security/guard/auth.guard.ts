import { Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { getHref, createMainRouterLink } from '../../route/route-utils';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {

  constructor(
    private router: Router,
    private oidcSecurityService: OidcSecurityService
  ) {}

  async isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    const isAuthenticated = this.oidcSecurityService.isAuthenticated$;

    if (!isAuthenticated) {
      this.oidcSecurityService.authorize();
      return false;
    }
    return true;
  }

  getRedirectUri(): string {
    return getHref(createMainRouterLink());
  }
}
