import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';
import { ColorPalettes, ColorPalette } from './color-palette.model';
import * as localData from '../assets/color-palettes.json';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ColorPaletteService {

  private colorPalettes: { [key: string]: ColorPalette } = {};
  private selectedPalette: ColorPalette | null = null;
  private palettesLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.loadColorPalettes();
  }

  private loadColorPalettes(): void {
    const paletteConfig = environment.config.COLOR_PALETTE;

    if (this.isUrl(paletteConfig)) {
      // Farbpaletten vom Server laden
      this.http.get<ColorPalettes>(paletteConfig).subscribe(
        palettes => {
          this.processColorPalettes(palettes);
          // Der Name der Farbpalette ist im URL-Parameter enthalten
          const url = new URL(paletteConfig);
          const paletteName = url.hash.substring(1);
          this.selectPalette(paletteName);
        },
        error => {
          console.error('Fehler beim Laden der Farbpaletten vom Server', error);
          this.palettesLoaded$.next(false);
        }
      );
    } else {
      // Lokale Farbpaletten laden
      this.loadLocalColorPalettes(paletteConfig);
    }
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
    this.selectPalette(paletteName);
  }

  private processColorPalettes(palettes: ColorPalettes): void {
    palettes['color-palettes'].forEach(palette => {
      this.colorPalettes[palette.name] = palette;
    });
    console.log('Color palettes loaded successfully:', this.colorPalettes); // Nach dem Laden der Farbpaletten
    this.palettesLoaded$.next(true);
  }

  selectPalette(paletteName: string) {
    this.selectedPalette = this.colorPalettes[paletteName];
  }

  getPalettesLoadedStatus(): BehaviorSubject<boolean> {
    return this.palettesLoaded$;
  }

  getSelectedPaletteName(): string | null {
    return this.selectedPalette ? this.selectedPalette.name : null;
  }

  getFontStyle(): string {
    if (!this.selectedPalette) {
      console.error('No palette selected.');
      return 'defaultColor';
    }
    return this.selectedPalette.style.font;
  }

  getBackgroundColor(): string {
    if (!this.selectedPalette) {
      console.error('No palette selected.');
      return 'defaultColor';
    }
    return this.selectedPalette.colors.background;
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
}
