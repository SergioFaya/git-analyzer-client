import { Component, OnDestroy, OnInit } from '@angular/core';
import { ICommitWebhook, IissueWebHook, IPullReqWebHook } from 'git-analyzer-types';
// @ts-ignore
import GitHubCalendar from 'github-calendar';
import { interval, Subscription } from 'rxjs';
import { RecentActivityService } from '../../services/RecentActivity/recent-activity.service';
import { getUserDataFromLocalStorage } from '../../util/util';
@Component({
	selector: 'app-landing-page',
	templateUrl: './landing-page.component.html',
	styleUrls: ['./landing-page.component.scss']
})

export class LandingPageComponent implements OnInit, OnDestroy {

	public issues: Array<IissueWebHook> = [];
	public pullRequests: Array<IPullReqWebHook> = [];
	public pushes: Array<ICommitWebhook> = [];

	private subscriptionIssues!: Subscription;
	private subscriptionPullReqs!: Subscription;
	private subscriptionPushes!: Subscription;


	constructor(private recentActivityService: RecentActivityService) { }

	ngOnInit() {
		var username = getUserDataFromLocalStorage().username;
		new GitHubCalendar(".calendar", username);
		const source = interval(60000);
		this.getRecentIssues();
		this.getRecentPullRequests();
		this.getRecentPushes();
		this.subscriptionIssues = source.subscribe(val => this.getRecentIssues());
		this.subscriptionPullReqs = source.subscribe(val => this.getRecentPullRequests());
		this.subscriptionPushes = source.subscribe(val => this.getRecentPushes());
	}

	ngOnDestroy() {
		this.subscriptionIssues.unsubscribe();
		this.subscriptionPullReqs.unsubscribe();
		this.subscriptionPushes.unsubscribe();
	}

	getRecentPushes() {
		this.recentActivityService
			.findRecentPushes()
			.then((pushes: Array<ICommitWebhook>) => {
				this.pushes = pushes;
			}).catch((err: any) => {
				console.log(err);
			});
	}

	getRecentIssues() {
		this.recentActivityService
			.findRecentIssues()
			.then((issues: Array<IissueWebHook>) => {
				this.issues = issues;
			}).catch((err: any) => {
				console.log(err);
			});
	}

	getRecentPullRequests() {
		this.recentActivityService
			.findRecentPullRequests()
			.then((pullRequests: Array<IPullReqWebHook>) => {
				this.pullRequests = pullRequests;
			}).catch((err: any) => {
				console.log(err);
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

	isFromMinutesAgo(timestamp: number) {
		var currentDate = new Date();
		var minutesAgo = currentDate;
		minutesAgo.setMinutes(minutesAgo.getMinutes() - 10);
		if (minutesAgo <= new Date(timestamp)) {
			return true;
		}
		return false;
	}
}


