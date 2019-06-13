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
				// FIXME: FIX  TYPE
				this.issues = issues;
			});
	}

	getDateFromTimestamp(timestamp: number) {
		// Create a new JavaScript Date object based on the timestamp
		// multiplied by 1000 so that the argument is in milliseconds, not seconds.
		var date = new Date(timestamp);
		// Hours part from the timestamp
		var hours = date.getHours();
		// Minutes part from the timestamp
		var minutes = "0" + date.getMinutes();
		// Seconds part from the timestamp
		var seconds = "0" + date.getSeconds();

		// Will display time in 10:30:23 format
		var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + ' - ' + this.formatDate(date);
		return formattedTime;
	}

	formatDate(date: Date) {
		var monthNames = [
			"January", "February", "March",
			"April", "May", "June", "July",
			"August", "September", "October",
			"November", "December"
		];

		var day = date.getDate();
		var monthIndex = date.getMonth();
		var year = date.getFullYear();

		return day + ' ' + monthNames[monthIndex] + ' ' + year;
	}

}


