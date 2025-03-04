import {Component, OnInit, HostListener, ViewChild, ElementRef} from '@angular/core';
import {TeilerService} from "../teiler/teiler.service";
import {createMainRouterLink} from "../route/route-utils";
import {ColorSchemeService} from "../color-scheme.service";
import {RouteManagerService} from "../route/route-manager.service";
import {TeilerApp} from "../teiler/teiler-app";
import {environment} from "../../environments/environment";


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {


  public innerWidth: any;
  public menuVisibleMobile: boolean = false;

  selectedBackground: string = 'background1';

  constructor(public teilerService: TeilerService, private colorSchemeService: ColorSchemeService, public routeManagerService: RouteManagerService) {
  }




  isGreyTheme(): boolean {
    return this.colorSchemeService.getColor() === 'rgb(211,211,211)';
  }
  isLilacTheme(): boolean {
    return this.colorSchemeService.getColor() === 'rgb(216, 191, 216)';
  }

  isBlueTheme(): boolean {
    return this.colorSchemeService.getColor() === 'rgb(30,144,255)';
  }

  isBrownTheme(): boolean {
    return this.colorSchemeService.getColor() === 'rgb(222,184,135)';
  }
  ngOnInit() {
      this.innerWidth = window.innerWidth;
  }
  getColor(): string {
    return this.colorSchemeService.getColor();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }

  public toggleMenu() {
    this.menuVisibleMobile = !this.menuVisibleMobile;
    console.log("toggleMenu", this.menuVisibleMobile);
    console.log("toggleMenu", this.innerWidth);
  }

  isMainSite() {
    let mainRouterLink = createMainRouterLink();
    return window.location.pathname === '/' + mainRouterLink;
  }

  isClickable(app:TeilerApp): boolean {
    return !!((app.backendReachable && app.frontendReachable) ||
      (app.backendReachable === undefined && app.frontendReachable) ||
      (app.backendReachable === null && app.frontendReachable));
  }

  protected readonly environment = environment;
}
