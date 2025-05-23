import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {TeilerService} from "../teiler/teiler.service";
import {TeilerAuthService} from "../security/teiler-auth.service";
import {from} from "rxjs";
import {TeilerApp} from "../teiler/teiler-app";


@Component({
    selector: 'teiler-main-menu',
    templateUrl: './teiler-main-menu.component.html',
    styleUrls: ['./teiler-main-menu.component.css'],
    standalone: false
})
export class TeilerMainMenuComponent implements OnInit {
  tab = 1;

  isLoggedIn: boolean = false;
  showLocalApps: boolean = true;
  showCentralApps: boolean = true;
  constructor(public teilerService: TeilerService, authService: TeilerAuthService) {
    from(authService.isLoggedId()).subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn);
  }

  ngOnInit(): void {
  }

  existLocalAndCentralTeilerAppsAtTheSameTime() {
    if (this.teilerService.teilerApps.length > 0) {
      let isLocal = this.teilerService.teilerApps[0].local;
      for (let teilerApp of this.teilerService.teilerApps) {
        if (teilerApp.local != isLocal) {
          return true;
        }
      }
    }
    return false;
  }

  isClickable(app:TeilerApp): boolean {
    return !!((app.backendReachable && app.frontendReachable) ||
      (app.backendReachable === undefined && app.frontendReachable) ||
      (app.backendReachable === null && app.frontendReachable));
  }

}
