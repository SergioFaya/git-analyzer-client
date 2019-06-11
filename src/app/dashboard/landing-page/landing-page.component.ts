import { Component, OnInit } from '@angular/core';
import { Iissue } from 'git-analyzer-types';
// @ts-ignore
import GitHubCalendar from 'github-calendar';
import { RecentActivityService } from '../../services/RecentActivity/recent-activity.service';
import { getUserDataFromLocalStorage } from '../../util/util';
@Component({
	selector: 'app-landing-page',
	templateUrl: './landing-page.component.html',
	styleUrls: ['./landing-page.component.scss']
})

export class LandingPageComponent implements OnInit {

	public issues: Array<Iissue> = [];

	constructor(private recentActivityService: RecentActivityService) { }

	ngOnInit() {
		var username = getUserDataFromLocalStorage().username;
		new GitHubCalendar(".calendar", username);

		this.recentActivityService
			.findRecentIssues()
			.then((issues: Array<Iissue>) => {
				this.issues = issues;
			});
	}

}
