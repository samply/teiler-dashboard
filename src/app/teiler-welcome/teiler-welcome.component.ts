import {Component, OnInit} from '@angular/core';
import {environment} from "../../environments/environment";

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

  welcomeTitle1: string = $localize`Willkommen auf Ihrem`
  welcomeTitle2: string = $localize`Brückenkopf`
  welcomeTitle: string = this.welcomeTitle1 + " " + environment.config.TEILER_PROJECT + " " + this.welcomeTitle2;

  welcomeMessage1: string = $localize`
    Sie befinden sich auf der Einstiegsseite des Brückenkopfes am Standort.
    Der Brückenkopf dient dazu, die Daten eines Standorts in ein DKTK-kompatibles Format zu überführen und für die anderen Komponenten nutzbar zu machen.
    Er ist zwar Software des DKTK, wird jedoch unter lokaler Hoheit, also der in betrieben.
    Weitere Informationen zum Brückenkopfkonzept finden Sie in den Konzepten der DKTK-Arbeitsgruppe CCP-IT, die Sie unter
  `
  welcomeMessage2: string = $localize`
    frei herunterladen können.
    Diese Seite zeigt, aus welchen Softwarekomponenten Ihr Brückenkopf besteht. Mit einem Linksklick auf einen Eintrag werden Sie zur entsprechenden Komponente weitergeleitet.
    Außerdem können Sie Erreichbarkeit und Version jeder Komponente einsehen.
  `
  welcomeMessage: string = this.welcomeMessage1 + ' <a href="https: //ccp-it.dktk.dkfz.de/">https: //ccp-it.dktk.dkfz.de/</a> ' + this.welcomeMessage2;

  constructor() {
  }

  ngOnInit(): void {
  }

}
