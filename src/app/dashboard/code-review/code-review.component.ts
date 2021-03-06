import { Component, OnInit } from '@angular/core';
import { ICodeReview } from 'git-analyzer-types';
// @ts-ignore
import * as UIkit from 'uikit';
import { CodeReviewService } from '../../services/CodeReviewService/code-review.service';
import { DisplayDashboardService } from '../../services/DisplayEvents/display-data.service';
import { getDateFromTimestamp, notify } from '../../util/util';
@Component({
	selector: 'app-code-review',
	templateUrl: './code-review.component.html',
	styleUrls: ['./code-review.component.scss']
})
export class CodeReviewComponent implements OnInit {

	public loading!: boolean;
	public reviews: Array<ICodeReview> = [];

	public review: ICodeReview = {};

	private typingTimer: any;
	private doneTypingInterval = 2000;
	public searchText!: string;

	constructor(private displayDashboardService: DisplayDashboardService, private codeReviewService: CodeReviewService) { }

	ngOnInit() {
		this.loading = true;
		this.getReviews();
	}

	getReviews() {
		this.codeReviewService
			.findAll()
			.then((result: Array<ICodeReview>) => {
				this.reviews = result;
				this.loading = false;
			})
			.catch((err: any) => {
				console.log(err);
				this.loading = false;
				this.displayDashboardService.loggedUser(false);

			});
	}

	deleteReviewClick(review: ICodeReview) {
		UIkit.modal.confirm('Are you shure you want to delete the review ' + review.title)
			.then(() => {
				this.deleteReview(review);
				console.log('Confirmed.')
			}, function () {
				console.log('Rejected.')
			});
	}

	deleteReview(review: any) {
		this.codeReviewService.deleteCodeReview(review.id)
			.then(() => {
				notify('Deleted successfully');
				this.getReviews();
			}).catch(() => {
				notify('Could not delete try again later');
			});
	}

	parseDate(timestamp: number) {
		return getDateFromTimestamp(timestamp);
	}

	getReviewsBySearch(search: string) {
		this.codeReviewService
			.search(search)
			.then((reviews: Array<ICodeReview>) => {
				this.loading = false;
				this.reviews = reviews;
			}).catch((err) => {
				console.log(err);
				notify('Could not perform search');
				this.loading = false;
				this.getReviews();
			});
	}

	// on keyup start the countdown 
	searchKeyUp(_event: any) {
		clearTimeout(this.typingTimer);
		this.typingTimer = setTimeout(() => {
			if (this.searchText.length > 3) {
				this.loading = true;
				this.getReviewsBySearch(this.searchText);
				this.searchText = '';
			}
		}, this.doneTypingInterval);
	}

	// on keydown clear the countdown
	searchKeyDown(_event: any) {
		clearTimeout(this.typingTimer);
	}
}
