import {Injectable} from '@angular/core';
import {TeilerService} from "../teiler/teiler.service";
import {EmbeddedTeilerApps, TeilerApp, TeilerAppRoute, TeilerRole} from "../teiler/teiler-app";
import {QualityReportComponent} from "../embedded/quality-report/quality-report.component";
import {Route, Router} from "@angular/router";
import {TeilerMainMenuComponent} from "../teiler-main-menu/teiler-main-menu.component";
import {
  TeilerAppPluginOrchestratorComponent
} from "../teiler-app-plugin-orchestrator/teiler-app-plugin-orchestrator.component";
import {authGuard} from "../security/guard/auth.guard";
import {
  BASE_LOGIN_ROUTER_LINK,
  BASE_LOGOUT_ROUTER_LINK,
  BASE_MAIN_ROUTER_LINK,
  createLoginRouterLink,
  createLogoutRouterLink,
  createMainRouterLink
} from "./route-utils";
import {ExporterComponent} from "../embedded/exporter/exporter.component";
import {ExecutionComponent} from "../embedded/execution/execution.component";

@Injectable({
  providedIn: 'root'
})
export class RouteManagerService {

  public mainRouterLink: string = BASE_MAIN_ROUTER_LINK;
  public loginRouterLink: string = BASE_LOGIN_ROUTER_LINK;
  public logoutRouterLink: string = BASE_LOGOUT_ROUTER_LINK;

  embeddedTeilerAppNameComponentMap = new Map<string, any>([
    {name: EmbeddedTeilerApps.QUALITY_REPORT, component: QualityReportComponent},
		{name: EmbeddedTeilerApps.EXPORTER, component: ExporterComponent},
		{name: EmbeddedTeilerApps.EXECUTION, component: ExecutionComponent}
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
      route.canActivate = [authGuard];
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
      canActivate: [authGuard]
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
