import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";
import {environment} from "../../environments/environment";

export interface ConfigVariable {
  variable: string;
  value: string;
  variableComment: string[];
}

export interface ConfigBlock {
  blockComment: string[]
  title: string;
  titleComment: string[];
  variables: ConfigVariable[];
  open?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TeilerConfigService {

  configBlocks: ConfigBlock[] = [];
  configBlocksbehaviorSubject = new BehaviorSubject(this.configBlocks);

  constructor(httpClient: HttpClient) {
    httpClient.get<ConfigBlock[]>(this.getTeilerBackendConfigUrl()).subscribe(configBlocks => {
      this.configBlocks = configBlocks;
      this.configBlocksbehaviorSubject.next(configBlocks);
    });
  }

  getTeilerBackendConfigUrl() {
    return environment.config.TEILER_BACKEND_URL + '/config';
  }

}
