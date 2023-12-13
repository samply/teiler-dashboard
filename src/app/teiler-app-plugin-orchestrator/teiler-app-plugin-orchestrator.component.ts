import {ChangeDetectionStrategy, Component} from '@angular/core';
import {mountRootParcel} from "single-spa";
import {Router} from "@angular/router";
import {TeilerService} from "../teiler/teiler.service";


declare global {
  interface Window {
    System: any;
  }
}

class PluginConfigurator {

  constructor(private route: string) {
  }

  config() {
    return window.System.import(this.route);
  }
}


@Component({
  selector: 'samply-teiler-app-plugin-orchestrator',
  template: '<parcel [config]="config" [mountParcel]="mountRootParcel"></parcel>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeilerAppPluginOrchestratorComponent {


  constructor(private router: Router, private teilerService: TeilerService) {
  }

  createAsyncConfig() {

    // @ts-ignore
    let pluginConfigurator = new PluginConfigurator(this.getRoute());

    return async (): Promise<any> => {
      return await pluginConfigurator.config();
    }

  }

  getRoute() {
    for (let teilerApp of this.teilerService.teilerApps) {
      if ('/' + teilerApp.routerLink === this.router.url) {
        return teilerApp.singleSpaLink;
      }
    }
    return "";
  }


  config = this.createAsyncConfig();
  mountRootParcel = mountRootParcel;

}
