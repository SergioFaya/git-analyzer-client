import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CodeReviewComponent } from './dashboard/code-review/code-review.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LandingPageComponent } from './dashboard/landing-page/landing-page.component';
import { ListOwnedOrgsComponent } from './dashboard/list-owned-orgs/list-owned-orgs.component';
import { ListReposUserComponent } from './dashboard/list-repos-user/list-repos-user.component';
import { RepoDetailsComponent } from './dashboard/repo-details/repo-details.component';
import { NavFullComponent } from './nav-full/nav-full.component';
import { NavLateralComponent } from './nav-lateral/nav-lateral.component';

@NgModule({
	declarations: [
		AppComponent,
		NavFullComponent,
		NavLateralComponent,
		DashboardComponent,
		ListReposUserComponent,
		RepoDetailsComponent,
		ListOwnedOrgsComponent,
		CodeReviewComponent,
		LandingPageComponent
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
