import { Component, OnInit } from '@angular/core';
import { ICodeReview, Iissue, IRepo } from 'git-analyzer-types';
import { CodeReviewService } from '../../services/CodeReviewService/code-review.service';
import { DisplayDashboardService } from '../../services/DisplayEvents/display-data.service';
import { RepoService } from '../../services/RepoService/repo.service';
import { getUserDataFromLocalStorage, notify } from '../../util/util';
@Component({
	selector: 'app-list-repos-user',
	templateUrl: './list-repos-user.component.html',
	styleUrls: ['./list-repos-user.component.scss']
})
export class ListReposUserComponent implements OnInit {

	public repos!: Array<IRepo>;
	public repoDetailed: any;
	public per_page = 5;
	public page = 1;
	public loading = false;

	public searchText!: string;

	private typingTimer: any;
	private doneTypingInterval = 2000;

	public review: ICodeReview = {};
	public createIssue: boolean = false;

	constructor(private dataService: DisplayDashboardService, private repoService: RepoService, private codeReviewService: CodeReviewService) { }

	ngOnInit() {
		this.loading = true;
		this.getUserRepos(this.page, this.per_page);
		this.clearForm();
	}

	getUserReposBySearch(search: string) {
		this.repoService.getAllReposPagedBySearch(search)
			.then((repos) => {
				this.repos = repos;
				this.loading = false;
			}).catch(err => console.log(err));
	}

	getUserRepos(page: number, per_page: number) {
		this.repos = [];
		this.loading = true;
		this.repoService.getAllReposPaged(String(page), String(per_page))
			.then((repos) => {
				this.loading = false;
				this.repos = repos;
			}).catch((err) => {
				console.log(err);
				notify('Error en listado: Vuelve a loggearte o prueba más tarde');
				this.dataService.loggedUser(false);
			});

	}

	getUserRepoByName(reponame: string) {
		this.repoService.getRepoByName(reponame)
			.then((repo) => {
				this.repoDetailed = repo;
				// separar comportamiento en el otro component
				this.dataService.detailedRepo(this.repoDetailed);
				this.dataService.showDashboard(DisplayDashboardService.repoDetailed);
			}).catch((err) => {
				console.log(err);
				notify('Error en listado: Vuelve a loggearte o prueba más tarde');
				this.dataService.loggedUser(false);
			});
	}

	// on keyup start the countdown 
	searchKeyUp(_event: any) {
		clearTimeout(this.typingTimer);
		this.typingTimer = setTimeout(() => {
			if (this.searchText.length > 3) {
				this.loading = true;
				this.getUserReposBySearch(this.searchText);
				this.searchText = '';
			}
		}, this.doneTypingInterval);
	}

	// on keydown clear the countdown
	searchKeyDown(_event: any) {
		clearTimeout(this.typingTimer);
	}

	pageUp() {
		this.page++;
		this.getUserRepos(this.page, this.per_page);
	}

	pageDown() {
		if (this.page > 1) {
			this.page--;
			this.getUserRepos(this.page, this.per_page);
		}
	}

	selectEvent() {
		this.getUserRepos(this.page, this.per_page);
	}

	reviewRepo(repo: any) {
		this.review.repository = repo;
	}

	closeModal() {
		var element: HTMLElement = document.getElementById('closeModalId') as HTMLElement;
		element.click();
	}

	createReview() {
		if (this.validateCodeReview()) {
			this.codeReviewService
				.newCodeReview(this.review)
				.then(() => {
					notify("Review created successfully");
					this.clearForm();
				}).catch(() => {
					this.clearForm();
				});
			this.closeModal();
		} else {
			notify("Invalid form data, title and evaluation is required")
		}

		if (this.createIssue === true) {
			this.codeReviewService
				.createIssueForCodeReview(this.review)
				.then((issue: Iissue) => {
					notify('<a class="uk-button" href="' + issue.html_url + '">Issue created</a>');
				}).catch(() => {
					notify('The associated issue could not be created please do it manually');
				});
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
		this.review = {} as ICodeReview;
		this.review.calification = 7;

	}
}
