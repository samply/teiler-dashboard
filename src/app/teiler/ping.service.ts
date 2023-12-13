import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TeilerApp} from "./teiler-app";
import {first} from "rxjs";

export interface BooleanSetter {
  (input: boolean): any;
}

@Injectable({
  providedIn: 'root'
})
export class PingService {

  constructor(private httpClient: HttpClient) {
  }

  isBackendReachable(teilerApp: TeilerApp) {
    if (teilerApp.externLink == true && teilerApp.backendUrl != null && teilerApp.backendUrl != undefined && (teilerApp.backendReachable == null || teilerApp.backendReachable == undefined)) {
      let setBackendReachable: BooleanSetter = function (input: boolean) {teilerApp.backendReachable = input};
      this.setIfUrlIsReachable(teilerApp.backendUrl, setBackendReachable);
    }
  }

  isFrontendReachable(teilerApp: TeilerApp) {
    if (teilerApp.externLink == true && teilerApp.sourceUrl != null && teilerApp.sourceUrl != undefined && (teilerApp.frontendReachable == null || teilerApp.frontendReachable == undefined)) {
      let setFrontendReachable: BooleanSetter = function (input: boolean) {teilerApp.frontendReachable = input};
      this.setIfUrlIsReachable(teilerApp.sourceUrl, setFrontendReachable);
    }
  }

  setIfUrlIsReachable(url: string, setter: BooleanSetter) {
    this.httpClient
      .get(url, {observe: 'response'})
      .pipe(first())
      .subscribe(response => setter(response.status == 200));
  }

}
