import {Injectable} from '@angular/core';
import {QualityReportService} from "./quality-report.service";
import {TEILER_ROLE_PUBLIC, TeilerApp} from "./teiler-app";
import {BehaviorSubject, filter, Observable, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {TeilerAuthService} from "../security/teiler-auth.service";
import {environment} from "../../environments/environment";
import {Event, NavigationStart, Router, RouterEvent} from "@angular/router";
import {getLocale} from "../route/route-utils";
import {ExporterService} from "./exporter.service";
import {ExecutionService} from "./execution.service";



@Injectable()
export class TeilerService {

  allTeilerApps: TeilerApp[] = [];
  teilerApps: TeilerApp[] = [];
  teilerAppBehaviorSubject = new BehaviorSubject(this.teilerApps);
  teilerGroupRoleMap: Map<string, string> = new Map<string, string>();


  constructor(
    private authService: TeilerAuthService,
    private router: Router,
    private httpClient: HttpClient,
    qualityReportService: QualityReportService,
		exporterService: ExporterService,
		executionService: ExecutionService
  ) {
    let embeddedTeilerApps = [
      qualityReportService,
			exporterService,
			executionService];


    //this.fetchTeilerDashboardAppsUrlAndUpdateTeilerApps(embeddedTeilerApps)
    //router.events.subscribe(myEvent => this.fetchTeilerDashboardAppsUrlAndUpdateTeilerApps(embeddedTeilerApps));

    /*** TODO: find better method to fetch and update the Teiler APPs. For now its called on 'NavigationStart'-Event from Router-Service   ***/
    this.router.events
      .pipe(
        filter((event: Event | RouterEvent) => event instanceof NavigationStart),
        tap(() => this.fetchTeilerDashboardRolesAndUpdateTeilerRoleGroupMap().then(
          () => this.fetchTeilerDashboardAppsUrlAndUpdateTeilerApps(embeddedTeilerApps))
        )
      )
      .subscribe();

  }

  async fetchTeilerDashboardAppsUrlAndUpdateTeilerApps(embeddedTeilerApps: TeilerApp[]) {
    this.httpClient.get<TeilerApp[]>(this.getTeilerDashboardAppsUrl()).subscribe(async teilerApps => {
      this.allTeilerApps = [];
      embeddedTeilerApps.forEach(teilerApp => this.allTeilerApps.push(teilerApp));
      this.addTeilerDashboardApps(teilerApps);
      this.sortTeilerApps();
      await this.filterTeilerApps();
      this.teilerAppBehaviorSubject.next(this.teilerApps);
    });
  }

  async fetchTeilerDashboardRolesAndUpdateTeilerRoleGroupMap() {
    this.httpClient.get<{[key:string]:string}>(this.getTeilerDashboardRolesUrl()).subscribe(async roleGroupMap => {
        this.teilerGroupRoleMap = new Map(Object.entries(roleGroupMap));
    });
  }

  getTeilerDashboardAppsUrl() {
    return environment.config.TEILER_BACKEND_URL + '/apps/' + getLocale();
  }

  getTeilerDashboardRolesUrl() {
    return environment.config.TEILER_BACKEND_URL + '/roles';
  }

  async filterTeilerApps(): Promise<void> {
    this.teilerApps = [];

    for (const teilerApp of this.allTeilerApps) {
      if (teilerApp.activated && await this.isAuthorized(teilerApp)) {
        this.teilerApps.push(teilerApp);
      }
    }
  }

  async isAuthorized(teilerApp: TeilerApp): Promise<boolean> {
    const teilerAppRoles = new Set(teilerApp.roles);

    if (teilerAppRoles.size === 0 || teilerAppRoles.has(TEILER_ROLE_PUBLIC)) {
      return true;
    }

    const roles = environment.config.OIDC_TOKEN_GROUP
      ? await this.authService.getGroups()
      : await this.authService.getRoles();

    for (let role of roles) {
      const mappedRole = this.teilerGroupRoleMap.get(role);
      if (mappedRole && teilerAppRoles.has(mappedRole)) {
        return true;
      }
    }

    return false;
  }

  addTeilerDashboardApps(teilerDashboardApps: TeilerApp[]) {

    let embeddedTeilerAppsMap = new Map(this.allTeilerApps.map(teilerApp => [teilerApp.name, teilerApp]));
    teilerDashboardApps.forEach(teilerDashboardApp => {
      if (embeddedTeilerAppsMap.has(teilerDashboardApp.name)) {
        // @ts-ignore
        this.mergeTeilerApps(embeddedTeilerAppsMap.get(teilerDashboardApp.name), teilerDashboardApp);
      } else {
        this.allTeilerApps.push(teilerDashboardApp);
      }
    });

  }

  mergeTeilerApps(embeddedTeilerApp: TeilerApp, teilerDashboardApp: TeilerApp) {
    Reflect.ownKeys(teilerDashboardApp).forEach(property => {
      let teilerCorAppValue = Reflect.get(teilerDashboardApp, property);
      if (teilerCorAppValue !== null && teilerCorAppValue !== undefined) {
        Reflect.set(embeddedTeilerApp, property, teilerCorAppValue);
      }
    })
  }

  followTeilerApps(): Observable<TeilerApp[]> {
    return this.teilerAppBehaviorSubject.asObservable();
  }

  sortTeilerApps() {
    this.allTeilerApps = this.allTeilerApps.sort((teilerApp1, teilerApp2) => this.compareOrder(teilerApp1, teilerApp2));
  }

  compareOrder(teilerApp1: TeilerApp, teilerApp2: TeilerApp): number {

    if (teilerApp1.order === undefined && teilerApp2.order === undefined) {
      return 0;
    } else if (teilerApp1.order !== undefined && teilerApp2.order === undefined) {
      return -1;
    } else if (teilerApp1.order === undefined && teilerApp2.order !== undefined) {
      return 1;
    } else {
      // @ts-ignore
      return teilerApp1.order - teilerApp2.order;
    }
  }

}
