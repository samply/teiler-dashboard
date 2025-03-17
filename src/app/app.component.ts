import {Component, OnInit} from '@angular/core';
import {RouteManagerService} from "./route/route-manager.service";
import {TeilerAuthService} from "./security/teiler-auth.service";
import {from, Observable} from "rxjs";
import {environment} from "../environments/environment";
import {StylingService} from "./styling.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {DomSanitizer} from "@angular/platform-browser";


@Component({
  selector: 'teiler-dashboard',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'teiler-dashboard';
  isLoggedIn: boolean = false;
  user: string = '';
  svgimage: any = ""

  constructor(public routeManagerService: RouteManagerService, public authService: TeilerAuthService, private stylingService: StylingService, private httpClient: HttpClient, private sanitizer: DomSanitizer) {
    from(authService.isLoggedId()).subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        from(authService.loadUserProfile()).subscribe(keycloakProfile => this.user = keycloakProfile.firstName + ' ' + keycloakProfile.lastName);
      }
    });
  }

  ngOnInit(): void {
    this.stylingService.getPalettesLoadedStatus().subscribe(loaded => {
      if (loaded) {
        const selectedPaletteName = this.stylingService.getSelectedPaletteName();
        if (selectedPaletteName) {
          this.setCSSVariables();
        } else {
          console.error('Keine Farbpalette ausgewählt.');
        }
      } else {
        console.error('Farbpaletten wurden nicht geladen.');
      }
    });
    this.setBackgroundImage()
  }

  private setCSSVariables() {

    const iconColor = this.stylingService.getIconColor();
    const textColor = this.stylingService.getTextColor();
    const lineColor = this.stylingService.getLineColor();
    const fontStyle = this.stylingService.getFontStyle() + ', sans-serif';

    this.setCSSVariable('--icon-color', iconColor);
    this.setCSSVariable('--text-color', textColor);
    this.setCSSVariable('--line-color', lineColor);
    this.setCSSVariable('--font-style', fontStyle);
  }

  private setCSSVariable(variableName: string, value: string) {
    document.documentElement.style.setProperty(variableName, value);
  }

  public setBackgroundImage() {
    const headers = new HttpHeaders();
    headers.set('Accept', 'image/svg+xml');
    this.httpClient.get(environment.config.BACKGROUND_IMAGE_URL, {headers, responseType: 'text'}).subscribe((svg) => {
      this.svgimage = svg;
      this.changeColor(this.stylingService.getBackgroundColor());
    });
  }
  changeColor(color: string): void {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this.svgimage, 'image/svg+xml');

    const paths = xmlDoc.getElementsByTagName('path');
    for (let i = 0; i < paths.length; i++) {
      paths[i].setAttribute('fill', color);
    }

    const serializer = new XMLSerializer();
    this.svgimage = this.sanitizer.bypassSecurityTrustHtml(serializer.serializeToString(xmlDoc));
  }
  protected readonly environment = environment;
}
