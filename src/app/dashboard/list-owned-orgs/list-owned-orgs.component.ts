import { Component, OnInit } from '@angular/core';
import { ICodeReview, Iissue, IOrg, IRepo } from 'git-analyzer-types';
import { CodeReviewService } from '../../services/CodeReviewService/code-review.service';
import { DisplayDashboardService } from '../../services/DisplayEvents/display-data.service';
import { OrganizationService } from '../../services/OrgService/organization.service';
import { RepoService } from '../../services/RepoService/repo.service';
import { getUserDataFromLocalStorage, notify } from '../../util/util';

@Component({
	selector: 'app-list-owned-orgs',
	templateUrl: './list-owned-orgs.component.html',
	styleUrls: ['./list-owned-orgs.component.scss']
})
export class ListOwnedOrgsComponent implements OnInit {

	public orgs: Array<IOrg>;
	public repos: Array<IRepo>;
	public loading: boolean;

	public displayedOrg: string;

	public per_page = 5;
	public page = 1;

	public review: ICodeReview = {};
	public createIssue: boolean = false;

	constructor(private orgService: OrganizationService,
		private dataService: DisplayDashboardService,
		private repoService: RepoService,
		private codeReviewService: CodeReviewService) {

		this.loading = true;
		this.orgs = [];
		this.repos = [];
		this.displayedOrg = "";
	}

	ngOnInit() {
		this.getOrganizationsOfUser();
	}

	getOrganizationsOfUser() {
		this.loading = true;
		this.orgService.findUserOrgs()
			.then((orgs: Array<IOrg>) => {
				this.orgs = orgs;
				this.loading = false;
			}).catch((err) => {
				console.log(err);
			})
	}

	getReposOfOrganization(orgname: string, page: number, per_page: number) {
		this.loading = true;
		this.orgService
			.findOrgRepos(orgname, String(page), String(per_page))
			.then((repos) => {
				this.repos = repos;
				this.loading = false;
			}).catch((err) => {
				console.log(err);
			})
	}

	getUserRepoByName(reponame: string) {
		this.repoService.getRepoByName(reponame)
			.then((repo) => {
				this.dataService.detailedRepo(repo);
				this.dataService.showDashboard(DisplayDashboardService.repoDetailed);
			}).catch((err) => {
				console.log(err);
				notify('Error en listado: Vuelve a loggearte o prueba más tarde');
				this.dataService.loggedUser(false);
			});
	}

	pageUp() {
		this.page++;
		this.getReposOfOrganization(this.displayedOrg, this.page, this.per_page);
	}

	pageDown() {
		if (this.page > 1) {
			this.page--;
			this.getReposOfOrganization(this.displayedOrg, this.page, this.per_page);
		}
	}

	selectEvent() {
		this.getReposOfOrganization(this.displayedOrg, this.page, this.per_page);
	}

	showReposOfOrgEvent(orgname: string) {
		this.displayedOrg = orgname;
		this.getReposOfOrganization(this.displayedOrg, this.page, this.per_page);
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
