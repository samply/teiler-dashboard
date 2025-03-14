import {Component, OnInit} from '@angular/core';
import {environment} from "../../environments/environment";
import {getLocale} from "../route/route-utils";


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

  locale = ""
  welcomeText = ""
  furtherInfo = ""
  /*welcomeTitle1: string = $localize`Willkommen auf Ihrem`
  welcomeTitle2: string = $localize`CCP-Brückenkopf`
  welcomeTitle: string = this.welcomeTitle1 + " " + environment.config.TEILER_PROJECT.toUpperCase() + "-" + this.welcomeTitle2;

  welcomeMessage1: string = $localize`
    Ihr Tool für die effiziente und sichere Integration onkologischer Daten im DKTK.
    Als Schlüsselelement der <b>Clinical Communication Plattform (CCP)</b> ermöglicht der Brückenkopf die Transformation von Standortdaten in ein DKTK-kompatibles Format und ermöglicht deren Nutzung im Konsortium. Betrieben unter lokaler Hoheit, unterstützt der Brückenkopf die standortübergreifende Forschung durch effiziente Datenhandhabung. <br>Diese Übersicht präsentiert die lokalen und zentralen Komponenten Ihres Brückenkopfs sowie deren Status und ermöglicht den Zugriff auf weitere Elemente der CCP-Plattform.

  `
  welcomeMessage2: string = $localize`
    Weitere Informationen zum Konzept des Brückenkopfs finden Sie unter:
  `
  welcomeMessage: string = this.welcomeMessage1 + '<br><br>' + this.welcomeMessage2 + '<br><a href="https://dktk.dkfz.de/klinische-plattformen/ccp-it">https://dktk.dkfz.de/klinische-plattformen/ccp-it</a><br><a href="https://github.com/samply/bridgehead">https://github.com/samply/bridgehead</a> ';
*/
  constructor() {
  }

  ngOnInit(): void {
    this.locale = getLocale();
    this.welcomeText = environment.config['TEILER_DASHBOARD_WELCOME_TEXT_'+this.locale.toUpperCase()];
    this.furtherInfo = environment.config['TEILER_DASHBOARD_FURTHER_INFO_'+this.locale.toUpperCase()];
  }

  protected readonly environment = environment;
}
