import { Component, Input, OnInit } from '@angular/core';
import { Keys } from '../models/Keys';
import { DisplayDashboardService } from '../services/DisplayEvents/display-data.service';
import { getUserDataFromLocalStorage } from '../util/util';

@Component({
	selector: 'app-nav-lateral',
	templateUrl: './nav-lateral.component.html',
	styleUrls: ['./nav-lateral.component.scss']
})
export class NavLateralComponent implements OnInit {

	// reference to parent class function
	@Input() logout!: Function;
	@Input() loginUrl!: string;
	imageUrl?: string;
	logged?: boolean;

	constructor(private dataService: DisplayDashboardService) { }

	ngOnInit() {
		this.logged = localStorage.getItem(Keys.LOGGED) == Keys.LOGGED;
		this.dataService.logged.subscribe((logged) => {
			this.logged = localStorage.getItem(Keys.LOGGED) == Keys.LOGGED;
		});
		//this.imageUrl = localStorage.getItem('avatarUrl') as string;
		this.asignImageUrl();
		this.dataService.image.subscribe((url) => {
			this.asignImageUrl();
		});
	}

	private asignImageUrl(): void {
		const userData = getUserDataFromLocalStorage();
		this.imageUrl = userData.imageUrl;
	}

	// dashboard content
	changeDashboardContent(dashboardContent: string) {
		this.dataService.showDashboard(dashboardContent);
	}

	displayRepoList() {
		this.changeDashboardContent(DisplayDashboardService.repoList);
	}
}
