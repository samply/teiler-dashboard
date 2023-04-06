import {Component, OnInit, HostListener} from '@angular/core';
import {TeilerService} from "../teiler/teiler.service";
import {createMainRouterLink} from "../route/route-utils";
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public innerWidth: any;
  public menuVisibleMobile: boolean = false;

  constructor(public teilerService: TeilerService) {
  }

  ngOnInit() {
      this.innerWidth = window.innerWidth;
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

}
