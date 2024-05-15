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


  fontColor: string = '';

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
          console.log('Verwendete Farbpalette:', selectedPaletteName);
          this.fontColor = this.colorPaletteService.getFontColor();
          console.log('Schriftfarbe:', this.fontColor);
        } else {
          console.error('Keine Farbpalette ausgewählt.');
        }
      } else {
        console.error('Farbpaletten wurden nicht geladen.');
      }
    });
  }


  protected readonly environment = environment;
}
