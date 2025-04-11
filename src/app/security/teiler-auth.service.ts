import { Injectable } from '@angular/core';
import { OidcSecurityService, UserDataResult } from 'angular-auth-oidc-client';
import {firstValueFrom, Observable} from 'rxjs';
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

  public async getRoles(): Promise<string[]> {
    const data = await firstValueFrom(this.oidcSecurityService.userData$);
    const claims = data?.userData || {};
    return claims?.roles || [];
  }


  public loadUserProfile(): Observable<any | null> {
    return this.oidcSecurityService.userData$;
  }

  public async getGroups(): Promise<string[]> {
    const data = await firstValueFrom(this.oidcSecurityService.userData$);
    const claims = data?.userData || {};
    const groupClaimName = environment.config.OIDC_TOKEN_GROUP;
    const rawGroups = claims?.[groupClaimName] || claims?.groups || [];
    return Array.isArray(rawGroups)
      ? rawGroups.map((g: string) => g.startsWith('/') ? g.substring(1) : g)
      : [];
  }

}
