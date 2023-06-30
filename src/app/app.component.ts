import {Component, OnInit} from '@angular/core';
import {RouteManagerService} from "./route/route-manager.service";
import {TeilerAuthService} from "./security/teiler-auth.service";
import {from, Observable} from "rxjs";
import { ColorSchemeService } from './color-scheme.service';


@Component({
  selector: 'teiler-ui',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  selectedColor: string = 'lightgrey';

  title = 'teiler-ui';
  isLoggedIn: boolean = false;
  user: string = '';


  constructor(public routeManagerService: RouteManagerService, public authService: TeilerAuthService,private colorSchemeService: ColorSchemeService) {
    from(authService.isLoggedId()).subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn){
        from(authService.loadUserProfile()).subscribe(keycloakProfile => this.user = keycloakProfile.firstName + ' '+ keycloakProfile.lastName);
      }
    });
  }
  changeColor() {
    this.colorSchemeService.setColor(this.selectedColor);
  }
}
