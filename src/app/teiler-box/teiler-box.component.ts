import {Component, Input, OnInit} from '@angular/core';
import {BackgroundColors, EmptyTeilerApp, TeilerApp} from "../teiler/teiler-app";

enum TeilerAppStatus {
  WORKING,
  NOT_WORKING,
  WAITING_FOR_RESULTS
}

@Component({
  selector: 'teiler-box',
  templateUrl: './teiler-box.component.html',
  styleUrls: ['./teiler-box.component.css']
})
export class TeilerBoxComponent implements OnInit {

  @Input() teilerApp: TeilerApp = new EmptyTeilerApp();

  constructor() {
  }


  ngOnInit() {
    this.teilerApp.backgroundColor = this.teilerApp.backgroundColor || BackgroundColors.GREEN;

  }

  getCheckIconClass(): string {
    switch (this.isTeilerAppWorking()) {
      case TeilerAppStatus.WORKING:
        return "bi bi-check-circle";
      case TeilerAppStatus.NOT_WORKING:
        return "bi bi-x-circle";
      default:
        return "bi bi-clock"
    }
  }

  isTeilerAppWorking(): TeilerAppStatus {

    if (this.isEmbeddedApp()) {
      if (!this.hasBackend()) {
        return TeilerAppStatus.WORKING;
      }
      if (!this.hasVariableAValue(this.teilerApp.backendReachable)) {
        return TeilerAppStatus.WAITING_FOR_RESULTS;
      }
      return (this.teilerApp.backendReachable) ? TeilerAppStatus.WORKING : TeilerAppStatus.NOT_WORKING;
    } else {
      if (this.teilerApp.frontendReachable == null || this.teilerApp.frontendReachable == undefined) {
        return TeilerAppStatus.WAITING_FOR_RESULTS;
      }
      return (this.teilerApp.frontendReachable) ? TeilerAppStatus.WORKING : TeilerAppStatus.NOT_WORKING;
    }

  }

  hasVariableAValue(variable: any): boolean {
    return variable != null && variable != undefined;
  }

  isEmbeddedApp(): boolean {
    return !this.hasVariableAValue(this.teilerApp.sourceUrl);
  }

  isExternalLink(): boolean {
    return this.hasVariableAValue(this.teilerApp.externLink);
  }

  hasBackend(): boolean {
    return this.hasVariableAValue(this.teilerApp.backendUrl);
  }

  getCheckIconTitle(): string {
    let frontendIconTitle = this.getCheckFrontendIconTitle();
    let backendIconTitle = this.getCheckBackendIconTitle();
    let title = (this.showFrontendCheck()) ? frontendIconTitle : "";
    if (this.showBackendCheck()){
      title = (title.length > 0) ? title + '\n' + backendIconTitle : backendIconTitle;
    }
    return title;
  }

  getCheckFrontendIconTitle(): string{
    return "Frontend " + this.getReachableTitle(this.teilerApp.frontendReachable);
  }
  getCheckBackendIconTitle(): string{
    return "Backend " + this.getReachableTitle(this.teilerApp.backendReachable);
  }

  getReachableTitle(reachable: boolean | undefined): string{
    if (!this.hasVariableAValue(reachable)){
      return "is not already known. Waiting for reply...";
    }
    return (reachable) ? "is reachable" : "is not reachable";
  }

  showFrontendCheck(): boolean {
    return (this.hasVariableAValue(this.teilerApp.frontendReachable) || (this.teilerApp.externLink));
  }

  showBackendCheck(): boolean {
    return (this.hasVariableAValue(this.teilerApp.backendReachable) || (this.teilerApp.externLink && this.hasVariableAValue(this.teilerApp.backendUrl)));
  }

}
