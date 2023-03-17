import {Injectable} from '@angular/core';
import {KeycloakService} from "keycloak-angular";
import {KeycloakProfile} from "keycloak-js";
import {getHref, getLocale} from "../route/route-utils";

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

}
