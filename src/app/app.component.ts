import {Component, OnInit} from '@angular/core';
import {RouteManagerService} from "./route/route-manager.service";
import {TeilerAuthService} from "./security/teiler-auth.service";
import {from, Observable} from "rxjs";
import {environment} from "../environments/environment";
import {ColorPaletteService} from "./color-palette.service";


@Component({
  selector: 'teiler-dashboard',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'teiler-dashboard';
  isLoggedIn: boolean = false;
  user: string = '';


  constructor(public routeManagerService: RouteManagerService, public authService: TeilerAuthService, private colorPaletteService: ColorPaletteService) {
    from(authService.isLoggedId()).subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        from(authService.loadUserProfile()).subscribe(keycloakProfile => this.user = keycloakProfile.firstName + ' ' + keycloakProfile.lastName);
      }
    });
  }

  ngOnInit(): void {
    this.colorPaletteService.getPalettesLoadedStatus().subscribe(loaded => {
      if (loaded) {
        const selectedPaletteName = this.colorPaletteService.getSelectedPaletteName();
        if (selectedPaletteName) {
          this.setCSSVariables();
        } else {
          console.error('Keine Farbpalette ausgewählt.');
        }
      } else {
        console.error('Farbpaletten wurden nicht geladen.');
      }
    });
  }

  private setCSSVariables() {

    const iconColor = this.colorPaletteService.getIconColor();
    const textColor = this.colorPaletteService.getTextColor();
    const lineColor = this.colorPaletteService.getLineColor();
    const fontStyle = this.colorPaletteService.getFontStyle() + ', sans-serif';

    this.setCSSVariable('--icon-color', iconColor);
    this.setCSSVariable('--text-color', textColor);
    this.setCSSVariable('--line-color', lineColor);
    this.setCSSVariable('--font-style', fontStyle);
  }

  private setCSSVariable(variableName: string, value: string) {
    document.documentElement.style.setProperty(variableName, value);
  }

  protected readonly environment = environment;
}
