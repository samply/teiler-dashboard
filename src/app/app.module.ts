import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';

import {AppRoutingModule, routingComponents} from './app-routing.module';
import {AppComponent} from './app.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatListModule} from "@angular/material/list";
import {SidebarComponent} from './sidebar/sidebar.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {HttpClientModule} from "@angular/common/http";
import {TeilerService} from "./teiler/teiler.service";
import { TeilerAppPluginOrchestratorComponent } from './teiler-app-plugin-orchestrator/teiler-app-plugin-orchestrator.component';
import {ParcelModule} from "single-spa-angular/parcel";

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    SidebarComponent,
    TeilerAppPluginOrchestratorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    NoopAnimationsModule,
    MatListModule,
    MatFormFieldModule,
    MatSelectModule,
    HttpClientModule,
    ParcelModule
  ],
  providers: [TeilerService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
