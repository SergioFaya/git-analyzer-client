import { Component, OnDestroy, OnInit } from '@angular/core';
import { ICommitWebhook, IissueWebHook, IPullReqWebHook } from 'git-analyzer-types';
// @ts-ignore
import GitHubCalendar from 'github-calendar';
import { interval, Subscription } from 'rxjs';
import { RecentActivityService } from '../../services/RecentActivity/recent-activity.service';
import { getUserDataFromLocalStorage, getDateFromTimestamp } from '../../util/util';
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

	parseDate(timestamp: number){
		return getDateFromTimestamp(timestamp);
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
