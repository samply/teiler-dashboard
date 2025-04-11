import { Injectable } from '@angular/core';
import { OidcSecurityService, UserDataResult } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { getHref, getLocale } from '../route/route-utils';
import { map } from 'rxjs/operators';

interface CustomUserData extends UserDataResult {
  roles?: string[];
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class TeilerAuthService {
  constructor(private oidcSecurityService: OidcSecurityService) {}

  public login() {
    this.oidcSecurityService.authorize();
  }

  public logout() {
    this.oidcSecurityService.logoff().subscribe(() => {
      window.location.href = getHref('/' + getLocale());
    });
  }

  public isLoggedId(): Observable<boolean> {
    return this.oidcSecurityService.isAuthenticated$.pipe(
      map(authResult => authResult.isAuthenticated)
    );
  }

  public getRoles(): Observable<string[]> {
    return this.oidcSecurityService.userData$.pipe(
      map((userData: CustomUserData) => {
        return userData?.roles || [];
      })
    );
  }

  public loadUserProfile(): Observable<any | null> {
    return this.oidcSecurityService.userData$;
  }

  public getGroups(): Observable<string[]> {
    return this.oidcSecurityService.userData$.pipe(
      map((userData: CustomUserData) => {
        const groups = userData?.[environment.config.OIDC_TOKEN_GROUP] || [];
        return groups.map((group: string) => {
          if (typeof group === 'string' && group.charAt(0) === '/') {
            return group.substring(1);
          }
          return group;
        });
      })
    );
  }
}
