import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {getLocale} from "../route/route-utils";
import {Observable, of} from "rxjs";

export interface ConfigVariables {
  BACKGROUND_IMAGE_URL?: string;
  COLOR_PALETTE?: string;
  COLOR_PROFILE?: string;
  FONT?: string;
  FURTHER_INFO?: string;
  LOGO_URL?: string;
  LOGO_HEIGHT?: number;
  LOGO_TEXT?: string;
  URL?: string;
  WELCOME_TEXT?: string;
  WELCOME_TITLE?: string;
}
@Injectable({
  providedIn: 'root'
})
export class DashboardConfigService {
  private config: Observable<ConfigVariables> = of({})
  locale = "";
  constructor(private httpClient: HttpClient) {
    this.locale = getLocale();
    const headers = new HttpHeaders();
    headers.set('Accept', 'application/xml');
    this.config = this.httpClient.get(environment.config.TEILER_BACKEND_URL + '/variables/' + this.locale, {headers, responseType: 'json'})
  }

  public getConfig(): Observable<ConfigVariables> {
    return this.config
  }
}
