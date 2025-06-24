import {Injectable, OnInit} from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {environment} from "../../environments/environment";
import {getLocale} from "../route/route-utils";
import {BehaviorSubject, map, Observable, of, switchMap} from "rxjs";
import {ColorPalettes} from "../color-palette.model";

export interface ConfigVariables {
  FURTHER_INFO?: string;
  LOGO_TEXT?: string;
  URL?: string;
  WELCOME_TEXT?: string;
  WELCOME_TITLE?: string;
  STYLING?: string;
}
export interface StyleVariables {
  backgroundImage?: string
  logo?: string
  logoMargin?: number
  logoHeight?: number
  colorPalette?: string
  useColorProfile?: string
  font?: string
}
@Injectable({
  providedIn: 'root'
})
export class DashboardConfigService {
  private configSubject = new BehaviorSubject<ConfigVariables>({} as ConfigVariables);
  private styleSubject = new BehaviorSubject<StyleVariables>({} as StyleVariables);
  private paletteSubject = new BehaviorSubject<ColorPalettes>({} as ColorPalettes);
  locale = "";
  constructor(private httpClient: HttpClient) {
    this.locale = getLocale();
    const headers = new HttpHeaders();
    headers.set('Accept', 'application/xml');
    this.httpClient.get<ConfigVariables>(environment.config.TEILER_BACKEND_URL + '/variables/' + this.locale, {headers, responseType: 'json'}).pipe(
      map((config) => {
        this.configSubject.next(config);
        return config.STYLING
      }),
      switchMap((styleUrl) => {
        if (styleUrl && this.isUrl(styleUrl)) return this.httpClient.get<StyleVariables>(styleUrl, {headers, responseType: 'json'})
        else return of(null)
      }),
      switchMap((style) => {
        if (style) this.styleSubject.next(style)
        if (style && style.colorPalette && this.isUrl(style.colorPalette)) {
          return this.httpClient.get<ColorPalettes>(style.colorPalette, {headers, responseType: 'json'})
        }
        else {
          return of(null)
        }
      })
    ).subscribe((palette) => {
      if (palette) this.paletteSubject.next(palette)
    })
  }

  public getConfig(): Observable<ConfigVariables> {
    return this.configSubject.asObservable()
  }
  public getStyle(): Observable<StyleVariables> {
    return this.styleSubject.asObservable()
  }
  public getColorPalettes(): Observable<ColorPalettes> {
   return this.paletteSubject.asObservable()
  }
  private isUrl(paletteConfig: string): boolean {
    try {
      new URL(paletteConfig);
      return true;
    } catch (_) {
      return false;
    }
  }
}
