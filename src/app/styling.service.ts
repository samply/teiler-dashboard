import { Injectable } from '@angular/core';
import {BehaviorSubject, of, switchMap, map, tap} from 'rxjs';
import { environment } from '../environments/environment';
import { ColorPalettes, ColorPalette } from './color-palette.model';
import * as localData from '../assets/color-palettes.json';
import { HttpClient } from '@angular/common/http';
import {ConfigVariables, DashboardConfigService, StyleVariables} from "./teiler/dashboard-config.service";

@Injectable({
  providedIn: 'root'
})
export class StylingService {

  private colorPalettes: { [key: string]: ColorPalette } = {};
  private selectedPalette: ColorPalette | null = null;
  private styleLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private palettesLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  config: ConfigVariables = {}
  style: StyleVariables = {}
  constructor(private http: HttpClient, private configService: DashboardConfigService) {
    this.getStyles()
  }

  private getStyles():void {
    this.configService.getStyle().subscribe({
      next: (styles) => {
        if (styles) {
          this.styleLoaded$.next(true)
          this.style = styles
          this.getPalettes()
        }
      },
      error: (error) => {
        this.styleLoaded$.next(false)
        this.loadLocalColorPalettes(environment.config.COLOR_PALETTE);
      }
    })
  }
  private getPalettes(): void {
    this.configService.getColorPalettes().subscribe({
      next: (palettes) => {
        if (palettes) {
          this.processColorPalettes(palettes);
          this.selectPalette(this.config.COLOR_PROFILE);
        }
      },
      error: (error) => {
        console.error('Fehler beim Laden der Farbpaletten vom Server', error);
        this.palettesLoaded$.next(false);
        this.loadLocalColorPalettes(environment.config.COLOR_PALETTE);
      }
    })
  }

  private loadLocalColorPalettes(paletteName: string): void {
    console.log('loadLocalColorPalettes method called'); // Vor dem Laden der Farbpaletten
    const palettes: ColorPalettes = (localData as any).default;
    this.processColorPalettes(palettes);
    this.selectPalette(environment.config.COLOR_PROFILE);
  }

  private processColorPalettes(palettes: ColorPalettes): void {
    palettes['color-palettes'].forEach(palette => {
      this.colorPalettes[palette.name] = palette;
    });
    //console.log('Color palettes loaded successfully:', this.colorPalettes); // Nach dem Laden der Farbpaletten
  }

  selectPalette(paletteName: string | undefined) {
    if(paletteName) {
      this.selectedPalette = this.colorPalettes[paletteName];
      this.palettesLoaded$.next(true);
    }
  }

  getPalettesLoadedStatus(): BehaviorSubject<boolean> {
    return this.palettesLoaded$;
  }
  getStyleLoadedStatus(): BehaviorSubject<boolean> {
    return this.styleLoaded$;
  }
  getSelectedPaletteName(): string | null {
    return this.selectedPalette ? this.selectedPalette.name : null;
  }

  getFontStyle(): string {
    return this.style.font ?? environment.config.FONT;
  }

  getTextColor(): string {
    if (!this.selectedPalette) {
      //console.error('No palette selected.');
      return 'defaultColor';
    }
    return this.selectedPalette.colors.text;
  }

  getLineColor(): string {
    if (!this.selectedPalette) {
      //console.error('No palette selected.');
      return 'defaultColor';
    }
    return this.selectedPalette.colors.line;
  }

  getIconColor(): string {
    if (!this.selectedPalette) {
      //console.error('No palette selected.');
      return 'defaultColor';
    }
    return this.selectedPalette.colors.icon;
  }
  getBackgroundColor(): string {
    if (!this.selectedPalette) {
      //console.error('No palette selected.');
      return '#ffffff';
    }
    return this.selectedPalette.colors.background;
  }
}
