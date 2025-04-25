import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import {loadBootstrapIconsCss} from "./load-bootstrap-icons";

if (environment.production) {
  enableProdMode();
}

loadBootstrapIconsCss(environment.config.TEILER_DASHBOARD_URL + '/' + environment.config.DEFAULT_LANGUAGE.toLowerCase());

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
