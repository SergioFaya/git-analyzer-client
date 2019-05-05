import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/DisplayEvents/display-data.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

	public showRepos: boolean;
	public showDetailedRepo: boolean;
	public showOrgs: boolean;

	constructor(private dataService: DataService) {
		this.showRepos = false;
		this.showDetailedRepo = false;
		this.showOrgs = false;
	}

	ngOnInit() {
		this.dataService.content.subscribe((content) => {
			if (content === DataService.repoList.toString()) {
				this.showRepos = true;
				this.showDetailedRepo = false;
				this.showOrgs = false;
			} else if (content === DataService.repoDetailed.toString()) {
				this.showRepos = false;
				this.showDetailedRepo = true;
				this.showOrgs = false;
			} else if (content === DataService.orgsList.toString()) {
				this.showRepos = false;
				this.showDetailedRepo = false;
				this.showOrgs = true;
			}
		});
	}

}