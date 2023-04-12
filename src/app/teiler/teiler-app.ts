import {Route, Router, Routes} from "@angular/router";
import {createRouterLinkForBase} from "../route/route-utils";

export enum TeilerRole {
  TEILER_PUBLIC = 'TEILER_PUBLIC',
  TEILER_USER = 'TEILER_USER',
  TEILER_ADMIN = 'TEILER_ADMIN'
}

export enum EmbeddedTeilerApps {
  CONFIGURATION = 'config',
  QUALITY_REPORT = 'quality-report',
  FUNCTION_TESTS = 'function-tests',
  EVENT_LOG = 'event-log',
  UPLOADS = 'uploads',
  ACTIVE_INQUIRIES = 'active-inquiries',
  ARCHIVED_INQUIRIES = 'archived-inquiries',
  FAILED_INQUIRIES = 'failed-inquiries',
  INQUIRY = 'inquiry',
  DIALOG_QUALI = 'dialog-quali',
  DIALOG_UPLOADS ='dialog-uploads',
  INQUIRY_DIALOG = 'inquiry-dialog',
  DIALOG_TESTS = 'dialog-tests'
}

export enum BackgroundColors {
  BLUE = '#1B9AAA',
  YELLOW = '#FFC43D',
  PINK = '#EF476F',
  GREEN = '#06D6A0',
}

export interface TeilerAppRoute extends Route {
  teilerAppName: string;
}

export interface TeilerApp {

  name: string;
  title: string;
  description: string;
  routerLink: string;
  routerLinkExtension?: string;
  singleSpaLink?: string;
  sourceUrl?: string;
  singleSpaMainJs?: string;
  externLink: boolean;
  activated: boolean;
  local: boolean;
  roles: TeilerRole[];
  iconClass?: string;
  iconSourceUrl?: string;
  backendUrl?: string;
  order?: number;
  inMenu: boolean;
  backendReachable?: boolean;
  frontendReachable?: boolean;
  subroutes?: TeilerAppRoute[];
  backgroundColor?: BackgroundColors;
}

export abstract class EmbeddedTeilerApp implements TeilerApp {

  abstract description: string;
  abstract iconClass: string | undefined;
  abstract iconSourceUrl: string | undefined;
  abstract title: string;
  abstract roles: TeilerRole[];

  activated: boolean = false;
  backendUrl: string | undefined = undefined;
  externLink: boolean = false;
  local: boolean = true;
  name: string = "";
  order: number | undefined = undefined;
  routerLink: string = "";
  singleSpaLink: string | undefined = undefined;
  singleSpaMainJs: string | undefined = undefined;
  sourceUrl: string | undefined = undefined;
  frontendReachable: boolean = true;
  inMenu: boolean = true;
  backgroundColor: BackgroundColors = BackgroundColors.GREEN;


  constructor(name: string, router: Router) {
    this.name = name;
    this.routerLink = createRouterLinkForBase(name);
    router.events.subscribe(routerEvent => this.routerLink = createRouterLinkForBase(name));
  }

}

export class EmptyTeilerApp implements TeilerApp {
  activated: boolean = false;
  backendUrl: undefined = undefined;
  description: string = "";
  externLink: boolean = false;
  iconClass: undefined = undefined;
  iconSourceUrl: undefined = undefined;
  local: boolean = true;
  name: string = "empty";
  order: undefined = undefined;
  roles: TeilerRole[] = [];
  routerLink: string = "/empty";
  singleSpaLink: undefined = undefined;
  singleSpaMainJs: undefined = undefined;
  sourceUrl: undefined = undefined;
  title: string = "";
  inMenu: boolean = false;
  backgroundColor: BackgroundColors = BackgroundColors.GREEN;
}
