import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';

import {AppRoutingModule, routingComponents} from './route/app-routing.module';
import {AppComponent} from './app.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatListModule} from "@angular/material/list";
import {SidebarComponent} from './sidebar/sidebar.component';

import {MatSelectModule} from "@angular/material/select";
import {HttpClientModule} from "@angular/common/http";
import {
  TeilerAppPluginOrchestratorComponent
} from './teiler-app-plugin-orchestrator/teiler-app-plugin-orchestrator.component';
import {ParcelModule} from "single-spa-angular/parcel";
import {ExternalLinkDirective} from './external-link.directive';
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import {initializeKeycloak} from "./security/keycloak/keycloak-init.factory";
import {TeilerModule} from "./teiler/teiler.module";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TeilerBoxComponent} from './teiler-box/teiler-box.component';
import {MatCardModule} from "@angular/material/card";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatGridListModule} from "@angular/material/grid-list";
import {TeilerWelcomeComponent} from './teiler-welcome/teiler-welcome.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatMenuModule} from "@angular/material/menu";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {BarChartModule} from "@swimlane/ngx-charts";
import {MatStepperModule} from "@angular/material/stepper";
import {MatTabsModule} from "@angular/material/tabs";
import {MatDialogModule} from "@angular/material/dialog";
import {ColorSchemeService} from "./color-scheme.service";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatSortModule} from "@angular/material/sort";
import {ExternalLinkBlankDirective} from "./external-link-blank.directive";

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    SidebarComponent,
    TeilerAppPluginOrchestratorComponent,
    ExternalLinkDirective,
    ExternalLinkBlankDirective,
    TeilerBoxComponent,
    TeilerWelcomeComponent
  ],
    imports: [
        AppRoutingModule,
        BarChartModule,
        BrowserModule,
        FlexLayoutModule,
        FormsModule,
        HttpClientModule,
        KeycloakAngularModule,
        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatSidenavModule,
        MatStepperModule,
        MatTabsModule,
        MatTableModule,
        MatToolbarModule,
        NoopAnimationsModule,
        ParcelModule,
        ReactiveFormsModule,
        TeilerModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonToggleModule,
        MatSortModule

    ],
  providers: [
    ColorSchemeService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
