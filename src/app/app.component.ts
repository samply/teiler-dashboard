import {Component, ElementRef, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {RouteManagerService} from "./route/route-manager.service";
import {TeilerAuthService} from "./security/teiler-auth.service";
import {debounceTime, from, fromEvent, throttleTime} from "rxjs";
import {environment} from "../environments/environment";
import {StylingService} from "./styling.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {DomSanitizer} from "@angular/platform-browser";
import {DashboardConfigService} from "./teiler/dashboard-config.service";


@Component({
  selector: 'teiler-dashboard',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  @ViewChild('myIdentifier') myIdentifier!: ElementRef;

  title = 'teiler-dashboard';
  isLoggedIn: boolean = false;
  user: string = '';
  svgOrig: any = ""
  svgimage: any = ""
  logoUrl: string = ""
  svgWidth: number = 2560;
  svgHeight: number = 1440;

  constructor(public routeManagerService: RouteManagerService, public authService: TeilerAuthService, private stylingService: StylingService, private httpClient: HttpClient, private sanitizer: DomSanitizer, private configService: DashboardConfigService) {
    from(authService.isLoggedId()).subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        from(authService.loadUserProfile()).subscribe(keycloakProfile => this.user = keycloakProfile.firstName + ' ' + keycloakProfile.lastName);
      }
    });
    this.configService.getConfig().subscribe((config) => {
      this.logoUrl = config.LOGO_URL ?? environment.config.LOGO_URL
    })

    fromEvent(window, "resize")
      .pipe(throttleTime(500), debounceTime(500))
      .subscribe(() => {
       this.updateSVG()
      });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.updateSVG()
      window.dispatchEvent(new Event('resize'));
    },800)
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
        //console.error('Farbpaletten wurden nicht geladen.');
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
    this.configService.getConfig().subscribe((config) => {
      if (config.BACKGROUND_IMAGE_URL) {
        const headers = new HttpHeaders();
        headers.set('Accept', 'image/svg+xml');
        this.httpClient.get(config.BACKGROUND_IMAGE_URL, {headers, responseType: 'text'}).subscribe((svg) => {
          this.svgOrig = svg;
          this.updateSVG()
        });
      }
    })
  }
  updateSVG(): void {
    this.svgWidth = this.myIdentifier.nativeElement.offsetWidth;
    this.svgHeight = this.myIdentifier.nativeElement.offsetHeight;

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this.svgOrig, 'image/svg+xml');

    const svg = xmlDoc.getElementsByTagName('svg');
    svg[0].setAttribute('width', this.svgWidth.toString())
    svg[0].setAttribute('height', this.svgHeight.toString())
    svg[0].setAttribute('viewBox', "0 0 "+this.svgWidth.toString()+" "+this.svgHeight.toString())

    const rect = xmlDoc.getElementsByTagName('rect');
    for (let i = 0; i < rect.length; i++) {
      rect[i].setAttribute('width', this.svgWidth.toString())
      rect[i].setAttribute('height', this.svgHeight.toString())
    }

    const stop = xmlDoc.getElementsByTagName('stop');
    if (stop.length > 1) {
      stop[1].setAttribute('stop-color', this.hexToRGB(this.stylingService.getBackgroundColor(), 0.18));}

    const serializer = new XMLSerializer();
    this.svgimage = this.sanitizer.bypassSecurityTrustHtml(serializer.serializeToString(xmlDoc));
  }

  hexToRGB(hex: string, alpha?: number) {
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
      return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
      return "rgb(" + r + ", " + g + ", " + b + ")";
    }
  }
  protected readonly environment = environment;
}
