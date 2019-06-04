import { Component, Input, OnInit } from '@angular/core';
import { DisplayDashboardService } from '../services/DisplayEvents/display-data.service';

@Component({
	selector: 'app-nav-lateral',
	templateUrl: './nav-lateral.component.html',
	styleUrls: ['./nav-lateral.component.scss']
})
export class NavLateralComponent implements OnInit {

	// reference to parent class function
	@Input() logout!: Function;
	@Input() loginUrl!: string;
	imageUrl!: string;
	logged!: boolean;

	constructor(private dataService: DisplayDashboardService) { }

	ngOnInit() {
		this.logged = localStorage.getItem('logged') == 'logged';
		this.dataService.logged.subscribe((logged) => {
			this.logged = localStorage.getItem('logged') == 'logged';
		});
		this.imageUrl = localStorage.getItem('avatarUrl') as string;
		this.dataService.image.subscribe((url) => {
			this.imageUrl = localStorage.getItem('avatarUrl') as string;
		});
	}

	// dashboard content
	changeDashboardContent(dashboardContent: string) {
		this.dataService.showDashboard(dashboardContent);
	}

	displayRepoList() {
		this.changeDashboardContent(DisplayDashboardService.repoList);
	}
}
