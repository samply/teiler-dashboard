import {Injectable} from '@angular/core';
import {KeycloakService} from "keycloak-angular";
import {KeycloakProfile} from "keycloak-js";
import {getHref, getLocale} from "../route/route-utils";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TeilerAuthService {

  constructor(private keycloakService: KeycloakService) {
  }

  public login() {
    this.keycloakService.login();
  }

  public logout() {
    this.keycloakService.logout(getHref('/' + getLocale()));
  }

  public isLoggedId() {
    return this.keycloakService.isLoggedIn();
  }

  public getRoles(): string[] {
    return this.keycloakService.getUserRoles();
  }

  public loadUserProfile(): Promise<KeycloakProfile> {
    return this.keycloakService.loadUserProfile();
  }

  public getGroups(): string[] {
    const keycloakInstance = this.keycloakService.getKeycloakInstance();
    const result = keycloakInstance?.tokenParsed?.[environment.config.KEYCLOAK_TOKEN_GROUP] || [];

    return result.map((group: string) => {
      if (typeof group === 'string' && group.charAt(0) === '/') {
        return group.substring(1); // Remove the first character if it's '/'
      }
      return group;
    });
  }


}
