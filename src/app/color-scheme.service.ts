import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorSchemeService {

  private currentColor: string = 'lightgrey';

  setColor(color: string) {
    this.currentColor = color;
  }

  getColor(): string {
    return this.currentColor;
  }
  constructor() { }
}
