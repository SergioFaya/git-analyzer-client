import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ICodeReview } from 'git-analyzer-types';
import { CodeReviewService } from '../../services/CodeReviewService/code-review.service';
import { DisplayDashboardService } from '../../services/DisplayEvents/display-data.service';
import { getUserDataFromLocalStorage, notify } from '../../util/util';


@Component({
	selector: 'app-code-review',
	templateUrl: './code-review.component.html',
	styleUrls: ['./code-review.component.scss']
})
export class CodeReviewComponent implements OnInit {

	@ViewChild('closeModalId')
	public closeModalId!: ElementRef;

	public loading!: boolean;
	public reviews!: any;

	public createIssue: boolean = false;
	public review: ICodeReview = {};
	constructor(private displayDashboardService: DisplayDashboardService, private codeReviewService: CodeReviewService) { }

	ngOnInit() {
		this.loading = true;
		this.getReviews();
		this.clearForm();
	}

	closeModal() {
		this.closeModalId.nativeElement.click();
	}

	createReview() {
		if (this.validateCodeReview()) {
			this.codeReviewService
				.newCodeReview(this.review)
				.then(() => {
					this.clearForm();
				}).catch(() => {
					this.clearForm();
				});
			this.closeModal();
		} else {
			notify("Invalid form data, title and evaluation is required")
		}
	}

	validateCodeReview(): boolean {
		if (this.review.title && this.review.title.length > 0 && this.review.calification) {
			const userData = getUserDataFromLocalStorage();
			this.review.created_by = userData;
			return true;
		}
		return false;
	}

	clearForm() {
		this.createIssue = false;
		this.review = {};
		this.review.calification = 7;
	}

	getReviews() {
		this.codeReviewService
			.findAll()
			.then((result) => {
				this.reviews = result;
				this.loading = false;
			})
			.catch((err) => {
				console.log(err);
				this.loading = false;
				this.displayDashboardService.loggedUser(false);

			});
	}
}
