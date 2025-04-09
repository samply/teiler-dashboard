import {Component, OnInit} from '@angular/core';
import {environment} from "../../environments/environment";
import {DashboardConfigService} from "../teiler/dashboard-config.service";


class TeilerAdmin {
  name: string | undefined;
  email: string | undefined;
  phone: string | undefined;


  constructor() {
    this.name = environment.config.TEILER_ADMIN_NAME;
    this.email = environment.config.TEILER_ADMIN_EMAIL;
    this.phone = environment.config.TEILER_ADMIN_PHONE;
  }
}

@Component({
  selector: 'teiler-welcome',
  templateUrl: './teiler-welcome.component.html',
  styleUrls: ['./teiler-welcome.component.css']
})
export class TeilerWelcomeComponent implements OnInit {

  teilerAdmin: TeilerAdmin = new TeilerAdmin();
  welcomeTitle = ""
  welcomeText = ""
  furtherInfo = ""

  constructor(private configService: DashboardConfigService) {
  }

  ngOnInit(): void {
    this.configService.getConfig().subscribe((config) => {
      this.welcomeTitle = config.WELCOME_TITLE ?? ""
      this.welcomeText = config.WELCOME_TEXT ?? ""
      this.furtherInfo = config.FURTHER_INFO ?? ""
    })
  }

  protected readonly environment = environment;
}
