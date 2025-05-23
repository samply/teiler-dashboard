import {Injectable} from '@angular/core';
import {QualityReportService} from "./quality-report.service";
import {TeilerApp, TeilerRole} from "./teiler-app";
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {TeilerAuthService} from "../security/teiler-auth.service";
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";
import {getLocale} from "../route/route-utils";
import {ExporterService} from "./exporter.service";
import {ExecutionService} from "./execution.service";



@Injectable()
export class TeilerService {

  allTeilerApps: TeilerApp[] = [];
  teilerApps: TeilerApp[] = [];
  teilerAppBehaviorSubject = new BehaviorSubject(this.teilerApps);


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
    this.fetchTeilerDashboardAppsUrlAndUpdateTeilerApps(embeddedTeilerApps)
    router.events.subscribe(myEvent => this.fetchTeilerDashboardAppsUrlAndUpdateTeilerApps(embeddedTeilerApps));
  }

  fetchTeilerDashboardAppsUrlAndUpdateTeilerApps(embeddedTeilerApps: TeilerApp[]) {
    this.httpClient.get<TeilerApp[]>(this.getTeilerDashboardAppsUrl()).subscribe(teilerApps => {
      this.allTeilerApps = [];
      embeddedTeilerApps.forEach(teilerApp => this.allTeilerApps.push(teilerApp));
      this.addTeilerDashboardApps(teilerApps);
      this.sortTeilerApps();
      this.filterTeilerApps()
      this.teilerAppBehaviorSubject.next(this.teilerApps);
    });
  }

  getTeilerDashboardAppsUrl() {
    return environment.config.TEILER_BACKEND_URL + '/apps/' + getLocale();
  }

  filterTeilerApps() {
    this.teilerApps = [];
    this.allTeilerApps.filter(teilerApp => teilerApp.activated && this.isAuthorized(teilerApp)).forEach(teilerApp => this.teilerApps.push(teilerApp))
  }

  isAuthorized(teilerApp: TeilerApp): boolean {
    let isAuthorized = false;
    let teilerAppRoles = new Set(teilerApp.roles);

    if (teilerAppRoles.size == 0) {
      isAuthorized = true;
    } else if (teilerAppRoles.has(TeilerRole.TEILER_PUBLIC)) {
      isAuthorized = true;
    } else {
      const roles$ = (environment.config.OIDC_TOKEN_GROUP) ? this.authService.getGroups() : this.authService.getRoles();

      roles$.subscribe(roles => {
        for (let role of roles) {
          let mappedRole = this.fetchRoleFromEnvironment(role);
          if (mappedRole !== undefined && teilerAppRoles.has(mappedRole)) {
            isAuthorized = true;
            break;
          }
        }
      });

    }

    return isAuthorized;
  }


  fetchRoleFromEnvironment(role: string): TeilerRole | undefined {
    if (role === environment.config.TEILER_USER) {
      return TeilerRole.TEILER_USER;
    } else if (role === environment.config.TEILER_ADMIN) {
      return TeilerRole.TEILER_ADMIN;
    } else {
      return undefined; // Role doesn't match any enum values
    }
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
