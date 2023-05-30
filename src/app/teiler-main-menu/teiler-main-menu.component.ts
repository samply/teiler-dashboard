import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {TeilerService} from "../teiler/teiler.service";
import {TeilerAuthService} from "../security/teiler-auth.service";
import {from} from "rxjs";


@Component({
  selector: 'teiler-main-menu',
  templateUrl: './teiler-main-menu.component.html',
  styleUrls: ['./teiler-main-menu.component.css'],

})
export class TeilerMainMenuComponent implements OnInit {

  isLoggedIn: boolean = false;

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
  selected= {
    name: 'Default',
    color: 'grey',
  }
  data = [{
    name: 'Lilac',
    color: 'rgb(216, 191, 216)',
  }, {
    name: 'Blue',
    color: 'rgb(30,144,255)'
  }, {
    name: 'Green',
    color: 'rgb(46,139,87)'
  }, {
    name: 'Brown',
    color: 'rgb(222,184,135)'
  }]
  compareObjects(o1: any, o2: any): boolean {
    return o1.color === o2.color
  }
}
