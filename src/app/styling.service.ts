import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';
import { ColorPalettes, ColorPalette } from './color-palette.model';
import * as localData from '../assets/color-palettes.json';
import { HttpClient } from '@angular/common/http';
import {ConfigVariables, DashboardConfigService} from "./teiler/dashboard-config.service";

@Injectable({
  providedIn: 'root'
})
export class StylingService {

  private colorPalettes: { [key: string]: ColorPalette } = {};
  private selectedPalette: ColorPalette | null = null;
  private palettesLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  config: ConfigVariables = {}
  constructor(private http: HttpClient, private configService: DashboardConfigService) {
    this.loadColorPalettes();
  }

  private loadColorPalettes(): void {
    this.configService.getConfig().subscribe((config)=> {
      this.config = config
      const paletteConfig = config.COLOR_PALETTE;

      if ( paletteConfig && this.isUrl(paletteConfig)) {
        // Farbpaletten vom Server laden
        this.http.get<ColorPalettes>(paletteConfig).subscribe(
          palettes => {
            this.processColorPalettes(palettes);
            this.selectPalette(config.COLOR_PROFILE);
          },
          error => {
            console.error('Fehler beim Laden der Farbpaletten vom Server', error);
            this.palettesLoaded$.next(false);
            this.loadLocalColorPalettes(environment.config.COLOR_PALETTE);
          }
        );
      } else {
        // Lokale Farbpaletten laden
        this.loadLocalColorPalettes(environment.config.COLOR_PALETTE);
      }
    })
  }

  private isUrl(paletteConfig: string): boolean {
    try {
      new URL(paletteConfig);
      return true;
    } catch (_) {
      return false;
    }
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
    console.log('Color palettes loaded successfully:', this.colorPalettes); // Nach dem Laden der Farbpaletten
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

  getSelectedPaletteName(): string | null {
    return this.selectedPalette ? this.selectedPalette.name : null;
  }

  getFontStyle(): string {
    return this.config.FONT ?? environment.config.FONT;
  }

  getTextColor(): string {
    if (!this.selectedPalette) {
      console.error('No palette selected.');
      return 'defaultColor';
    }
    return this.selectedPalette.colors.text;
  }

  getLineColor(): string {
    if (!this.selectedPalette) {
      console.error('No palette selected.');
      return 'defaultColor';
    }
    return this.selectedPalette.colors.line;
  }

  getIconColor(): string {
    if (!this.selectedPalette) {
      console.error('No palette selected.');
      return 'defaultColor';
    }
    return this.selectedPalette.colors.icon;
  }
  getBackgroundColor(): string {
    if (!this.selectedPalette) {
      console.error('No palette selected.');
      return 'defaultColor';
    }
    return this.selectedPalette.colors.background;
  }
}
