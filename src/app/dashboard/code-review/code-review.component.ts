import { Component, OnInit } from '@angular/core';
import { ICodeReview } from 'git-analyzer-types';
// @ts-ignore
import * as UIkit from 'uikit';
import { CodeReviewService } from '../../services/CodeReviewService/code-review.service';
import { DisplayDashboardService } from '../../services/DisplayEvents/display-data.service';
import { notify, getDateFromTimestamp } from '../../util/util';
@Component({
	selector: 'app-code-review',
	templateUrl: './code-review.component.html',
	styleUrls: ['./code-review.component.scss']
})
export class CodeReviewComponent implements OnInit {

	public loading!: boolean;
	public reviews: Array<ICodeReview> = [];

	public review: ICodeReview = {};
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

	parseDate(timestamp: number){
		return getDateFromTimestamp(timestamp);
	}
}
