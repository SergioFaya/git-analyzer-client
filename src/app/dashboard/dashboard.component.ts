import { Component, OnInit } from '@angular/core';
import { DisplayDashboardService } from '../services/DisplayEvents/display-data.service';
@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

	public showRepos: boolean;
	public showDetailedRepo: boolean;
	public showOrgs: boolean;
	public showCodeReview: boolean;

	constructor(private dataService: DisplayDashboardService) {
		this.showRepos = false;
		this.showDetailedRepo = false;
		this.showOrgs = false;
		this.showCodeReview = false;
	}

	ngOnInit() {

		this.dataService.content.subscribe((content) => {
			if (content === DisplayDashboardService.repoList.toString()) {
				this.showRepos = true;
				this.showDetailedRepo = false;
				this.showOrgs = false;
				this.showCodeReview = false;
			} else if (content === DisplayDashboardService.repoDetailed.toString()) {
				this.showRepos = false;
				this.showDetailedRepo = true;
				this.showOrgs = false;
				this.showCodeReview = false;
			} else if (content === DisplayDashboardService.orgsList.toString()) {
				this.showRepos = false;
				this.showDetailedRepo = false;
				this.showOrgs = true;
				this.showCodeReview = false;
			} else if (content === DisplayDashboardService.codeReview.toString()) {
				this.showRepos = false;
				this.showDetailedRepo = false;
				this.showOrgs = false;
				this.showCodeReview = true;
			}
		});
	}

}