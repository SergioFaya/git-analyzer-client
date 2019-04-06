import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/DisplayEvents/display-data.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

	public showTokenForm: boolean;
	public showRepos: boolean;
	public showDetailedRepo: boolean;

	constructor(private dataService: DataService) {
		this.showTokenForm = false;
		this.showRepos = false;
		this.showDetailedRepo = false;
	}

	ngOnInit() {
		this.dataService.content.subscribe((content) => {
			if (content === this.dataService.repoList.toString()) {
				this.showRepos = true;
				this.showDetailedRepo = false;
			} else if (content === this.dataService.repoDetailed.toString()) {
				this.showRepos = false;
				this.showDetailedRepo = true;
			}
		});
	}

}