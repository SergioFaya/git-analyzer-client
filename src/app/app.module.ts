import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
// no se porqué pero no puedo quitar el import
import { HttpClientModule } from '@angular/common/http';
import { NavFullComponent } from './nav-full/nav-full.component';
import { NavLateralComponent } from './nav-lateral/nav-lateral.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListReposUserComponent } from './dashboard/list-repos-user/list-repos-user.component';
import { RepoDetailsComponent } from './dashboard/repo-details/repo-details.component';

@NgModule({
  declarations: [
    AppComponent,
    NavFullComponent,
    NavLateralComponent,
    DashboardComponent,
    ListReposUserComponent,
    RepoDetailsComponent
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
