import {Injectable, OnInit} from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {environment} from "../../environments/environment";
import {getLocale} from "../route/route-utils";
import {BehaviorSubject, map, Observable, of, switchMap} from "rxjs";
import {ColorPalettes} from "../color-palette.model";

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
  STYLING?: string;
}
export interface StyleVariables {
  backgroundImage?: string
  logo?: string
  logoText?: string
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
  public $config: Observable<ConfigVariables> = this.configSubject.asObservable();
  private styleSubject = new BehaviorSubject<StyleVariables>({} as StyleVariables);
  public $style: Observable<StyleVariables> = this.styleSubject.asObservable();
  private paletteSubject = new BehaviorSubject<ColorPalettes>({} as ColorPalettes);
  public $palette: Observable<ColorPalettes> = this.paletteSubject.asObservable();
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
    return this.$config
  }
  public getStyle(): Observable<StyleVariables> {
    return this.$style
  }
  public getColorPalettes(): Observable<ColorPalettes> {
   return this.$palette
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
