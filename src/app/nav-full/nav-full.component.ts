import { Component, Input, OnInit } from '@angular/core';
import { IUserData } from 'git-analyzer-types';
import { Keys } from '../models/Keys';
import { DisplayDashboardService } from '../services/DisplayEvents/display-data.service';
import { getUserDataFromLocalStorage } from '../util/util';
import { environment } from 'src/environments/environment';
@Component({
	selector: 'app-nav-full',
	templateUrl: './nav-full.component.html',
	styleUrls: ['./nav-full.component.scss']
})
export class NavFullComponent implements OnInit {

	// reference to parent class function
	@Input() logout!: Function;
	@Input() loginUrl!: string;
	imageUrl?: string;
	logged?: boolean;
	client_id!: string;

	constructor(private dataService: DisplayDashboardService) {
		this.imageUrl = '';
		this.client_id = environment.client_id
 	}

	ngOnInit() {
		this.logged = localStorage.getItem(Keys.LOGGED) == Keys.LOGGED;
		this.dataService.logged.subscribe((logged) => {
			this.logged = localStorage.getItem(Keys.LOGGED) == Keys.LOGGED;
		});
		if (this.logged) {
			this.asignImageUrl()
			this.dataService.image.subscribe(() => {
				this.asignImageUrl();
			});
		}
	}

	private asignImageUrl(): void {
		const userData: IUserData = getUserDataFromLocalStorage();
		this.imageUrl = userData.imageUrl;
	}

	displayRepoList() {
		this.dataService.showDashboard(DisplayDashboardService.repoList);
	}

	displayOrganizations() {
		this.dataService.showDashboard(DisplayDashboardService.orgsList);
	}

	displayCodeReview() {
		this.dataService.showDashboard(DisplayDashboardService.codeReview);
	}

	displayLanding() {
		this.dataService.showDashboard(DisplayDashboardService.landing);
	}
}
