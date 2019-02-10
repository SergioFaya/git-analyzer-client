import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
// no se porqué pero no puedo quitar el import
import { HttpClientModule } from '@angular/common/http';
import { Http } from '@angular/http';
import { NavFullComponent } from './nav-full/nav-full.component';
import { NavLateralComponent } from './nav-lateral/nav-lateral.component';
import { DashboardComponent } from './dashboard/dashboard.component';


@NgModule({
  declarations: [
    AppComponent,
    NavFullComponent,
    NavLateralComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
