import {Injectable} from '@angular/core';
import {TeilerService} from "../teiler/teiler.service";
import {EmbeddedTeilerApps, TeilerApp, TeilerAppRoute, TeilerRole} from "../teiler/teiler-app";
import {ConfigurationComponent} from "../embedded/configuration/configuration.component";
import {QualityReportComponent} from "../embedded/quality-report/quality-report.component";
import {Route, Router, Routes} from "@angular/router";
import {TeilerMainMenuComponent} from "../teiler-main-menu/teiler-main-menu.component";
import {
  TeilerAppPluginOrchestratorComponent
} from "../teiler-app-plugin-orchestrator/teiler-app-plugin-orchestrator.component";
import {AuthGuard} from "../security/guard/auth.guard";
import {FunctionTestsComponent} from "../embedded/function-tests/function-tests.component";
import {EventLogComponent} from "../embedded/event-log/event-log.component";
import {
  BASE_LOGIN_ROUTER_LINK,
  BASE_LOGOUT_ROUTER_LINK,
  BASE_MAIN_ROUTER_LINK,
  createLoginRouterLink,
  createLogoutRouterLink,
  createMainRouterLink
} from "./route-utils";
import {UploadsComponent} from "../embedded/uploads/uploads.component";
import {ActiveInquiriesComponent} from "../embedded/inquiries/active-inquiries.component";
import {ArchivedInquiriesComponent} from "../embedded/inquiries/archived-inquiries.component";
import {FailedInquiriesComponent} from "../embedded/inquiries/failed-inquiries.component";
import {InquiryComponent} from "../embedded/inquiries/inquiry/inquiry.component";
import {InquiryDialogComponent} from "../embedded/pop-ups/inquiry-dialog/inquiry-dialog.component";
import {DialogUploadsComponent} from "../embedded/pop-ups/dialog-uploads/dialog-uploads.component";
import {DialogQualiComponent} from "../embedded/pop-ups/dialog-quali/dialog-quali.component";
import {DialogTestsComponent} from "../embedded/pop-ups/dialog-tests/dialog-tests.component";

@Injectable({
  providedIn: 'root'
})
export class RouteManagerService {

  public mainRouterLink: string = BASE_MAIN_ROUTER_LINK;
  public loginRouterLink: string = BASE_LOGIN_ROUTER_LINK;
  public logoutRouterLink: string = BASE_LOGOUT_ROUTER_LINK;

  embeddedTeilerAppNameComponentMap = new Map<string, any>([
    {name: EmbeddedTeilerApps.CONFIGURATION, component: ConfigurationComponent},
    {name: EmbeddedTeilerApps.QUALITY_REPORT, component: QualityReportComponent},
    {name: EmbeddedTeilerApps.FUNCTION_TESTS, component: FunctionTestsComponent},
    {name: EmbeddedTeilerApps.EVENT_LOG, component: EventLogComponent},
    {name: EmbeddedTeilerApps.UPLOADS, component: UploadsComponent},
    {name: EmbeddedTeilerApps.ACTIVE_INQUIRIES, component: ActiveInquiriesComponent},
    {name: EmbeddedTeilerApps.ARCHIVED_INQUIRIES, component: ArchivedInquiriesComponent},
    {name: EmbeddedTeilerApps.FAILED_INQUIRIES, component: FailedInquiriesComponent},
    {name: EmbeddedTeilerApps.INQUIRY, component: InquiryComponent},
    {name: EmbeddedTeilerApps.INQUIRY_DIALOG, component: InquiryDialogComponent},
    {name: EmbeddedTeilerApps.DIALOG_UPLOADS, component: DialogUploadsComponent},
    {name: EmbeddedTeilerApps.DIALOG_QUALI, component: DialogQualiComponent},
    {name: EmbeddedTeilerApps.DIALOG_TESTS, component: DialogTestsComponent}
  ].map(teilerAppComponent => [teilerAppComponent.name, teilerAppComponent.component]));

  constructor(teilerService: TeilerService, private router: Router) {
    teilerService.followTeilerApps().subscribe(teilerApps => {
      this.router.resetConfig(this.fetchRoutes(teilerApps));

      this.mainRouterLink = createMainRouterLink();
      this.loginRouterLink = createLoginRouterLink();
      this.logoutRouterLink = createLogoutRouterLink();
    });
  }

  getTeilerAppsNames(teilerApps: TeilerApp[]): string[] {
    let teilerAppsNames: string[] = [];
    teilerApps.forEach(teilerApp => teilerAppsNames.push(teilerApp.name));
    return teilerAppsNames;
  }

  private fetchRoutes(teilerApps: TeilerApp[]) {
    let routes: Route[] = [];
    RouteManagerService.addFirstRoutes(routes);
    teilerApps.filter(teilerApp => teilerApp.activated && !teilerApp.externLink).forEach(teilerApp => this.addTeilerAppToRoutes(teilerApp, routes));
    RouteManagerService.addFinalRoutes(routes);

    return routes;
  }

  private addTeilerAppToRoutes(teilerApp: TeilerApp, routes: Route[]) {
    let route: Route = {path: teilerApp.routerLink + (teilerApp.routerLinkExtension ?? '')}
    this.completeRoute(route, teilerApp, teilerApp.name, teilerApp.subroutes as Route[]);
    routes.push(route);
  }

  private completeRoute(route: Route, teilerApp: TeilerApp, routeName: string, subroutes: Route[]) {
    if (teilerApp.roles && !teilerApp.roles.includes(TeilerRole.TEILER_PUBLIC)) {
      route.canActivate = [AuthGuard];
    }

    route.component = this.getComponent(routeName);

    if (subroutes != undefined) {
      route.children = subroutes;
      subroutes.forEach(subroute => {
        // @ts-ignore
        this.completeRoute(subroute, teilerApp, subroute['teilerAppName'], subroute.children);
      })
    }

  }

  private getComponent(teilerAppName: string) {
    return (this.embeddedTeilerAppNameComponentMap.has(teilerAppName)) ? this.embeddedTeilerAppNameComponentMap.get(teilerAppName) : TeilerAppPluginOrchestratorComponent;
  }

  private static addFirstRoutes(routes: Route[]) {
    routes.push({path: createMainRouterLink(), component: TeilerMainMenuComponent});
    routes.push({
      path: createLoginRouterLink(),
      component: TeilerMainMenuComponent,
      canActivate: [AuthGuard]
    });
    routes.push({path: createLogoutRouterLink(), component: TeilerMainMenuComponent});
  }


  private static addFinalRoutes(routes: Route[]) {
    routes.push({path: '**', redirectTo: createMainRouterLink()});
  }

  public static fetchBasicRoutes() {
    let routes: Route[] = [];

    this.addFirstRoutes(routes);
    this.addFinalRoutes(routes);

    return routes;
  }

}
