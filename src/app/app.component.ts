import { Component } from '@angular/core';
import {RouteManagerService} from "./route/route-manager.service";
import {TeilerAuthService} from "./security/teiler-auth.service";
import {from} from "rxjs";


@Component({
  selector: 'teiler-ui',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'teiler-ui';
  isLoggedIn: boolean = false;
  user: string = '';


  constructor(public routeManagerService: RouteManagerService, public authService: TeilerAuthService) {
    from(authService.isLoggedId()).subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn){
        from(authService.loadUserProfile()).subscribe(keycloakProfile => this.user = keycloakProfile.firstName + ' '+ keycloakProfile.lastName);
      }
    });
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
