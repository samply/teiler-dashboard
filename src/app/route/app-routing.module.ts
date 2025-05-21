import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TeilerMainMenuComponent} from "../teiler-main-menu/teiler-main-menu.component";
import {QualityReportComponent} from "../embedded/quality-report/quality-report.component";
import {TeilerModule} from "../teiler/teiler.module";
import {RouteManagerService} from "./route-manager.service";
import {EmptyRouteComponent} from "../empty-route/empty-route.component";
import {APP_BASE_HREF} from "@angular/common";
import {
  TeilerAppPluginOrchestratorComponent
} from "../teiler-app-plugin-orchestrator/teiler-app-plugin-orchestrator.component";
import {LanguageSelectorComponent} from "../language-selector/language-selector.component";
import { ExporterComponent } from '../embedded/exporter/exporter.component';
import { ExecutionComponent } from '../embedded/execution/execution.component';



export const routingComponents = [
  EmptyRouteComponent,
  TeilerMainMenuComponent,
  QualityReportComponent,
  LanguageSelectorComponent,
  TeilerAppPluginOrchestratorComponent,
	ExporterComponent,
	ExecutionComponent
]

const routes: Routes = RouteManagerService.fetchBasicRoutes();

// Prod: imports: [RouterModule.forRoot(routes), TeilerModule],
// Test: imports: [RouterModule.forRoot(routes, { enableTracing: true }), TeilerModule],
@NgModule({
  imports: [RouterModule.forRoot(routes), TeilerModule],
  exports: [RouterModule],
  providers: [{provide: APP_BASE_HREF, useValue: '/'}]
})

export class AppRoutingModule {
}
