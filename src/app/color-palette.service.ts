import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import {image} from '../assets/'

@Injectable({
  providedIn: 'root'
})
export class ColorPaletteService {

  private colorPalettes: any = {};
  private selectedPalette: any;
  private palettesLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.loadColorPalettes().subscribe(() => {
      this.palettesLoaded$.next(true);
      const paletteName = environment.config.COLOR_PALETTE;
      this.selectPalette(paletteName);
    });
  }

  private loadColorPalettes(): Observable<any> {
    console.log('loadColorPalettes method called'); // Vor dem Laden der Farbpaletten
    return this.http.get('./assets/color-palettes.json').pipe(
      tap((palettes: any) => {
        console.log('Color palettes loaded successfully:', palettes); // Nach dem Laden der Farbpaletten
        this.colorPalettes = palettes;
      })
    );
  }

  selectPalette(paletteName: string) {
    this.selectedPalette = this.colorPalettes[paletteName];
  }

  getPalettesLoadedStatus(): Observable<boolean> {
    return this.palettesLoaded$.asObservable();
  }
  getSelectedPaletteName() {
    return this.selectedPalette ? this.selectedPalette.name : null;
  }

  getFontColor() {
    if (!this.selectedPalette) {
      console.error('No palette selected.');
      return null;
    }
    return this.selectedPalette.font;
  }

  getBackgroundColor() {
    if (!this.selectedPalette) {
      console.error('No palette selected.');
      return null;
    }
    return this.selectedPalette.background;
  }

  getTextColor() {
    if (!this.selectedPalette) {
      console.error('No palette selected.');
      return null;
    }
    return this.selectedPalette.text;
  }

  getLineColor() {
    if (!this.selectedPalette) {
      console.error('No palette selected.');
      return null;
    }
    return this.selectedPalette.line;
  }
}
