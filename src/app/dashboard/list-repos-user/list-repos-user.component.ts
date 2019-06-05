import { Component, OnInit } from '@angular/core';
import { IRepo } from 'git-analyzer-types';
import { DisplayDashboardService } from '../../services/DisplayEvents/display-data.service';
import { RepoService } from '../../services/RepoService/repo.service';
import { notify } from '../../util/util';
@Component({
	selector: 'app-list-repos-user',
	templateUrl: './list-repos-user.component.html',
	styleUrls: ['./list-repos-user.component.scss']
})
export class ListReposUserComponent implements OnInit {

	public repos!: Array<IRepo>;
	repoDetailed: any;
	public per_page = 5;
	public page = 1;
	loading = false;
	public searchText!: string;

	// search keyup keydown control 
	private typingTimer: any;
	private doneTypingInterval = 2000;

	constructor(private dataService: DisplayDashboardService, private repoService: RepoService) { }

	ngOnInit() {
		this.loading = true;
		this.getUserRepos(this.page, this.per_page);
	}

	getUserReposBySearch(page: number, per_page: number, search: string) {
		this.repoService.getAllReposPagedBySearch(String(page), String(per_page), search)
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

	// utilities

	// on keyup start the countdown 
	searchKeyUp(_event: any) {
		clearTimeout(this.typingTimer);
		this.typingTimer = setTimeout(() => {
			if (this.searchText.length > 3) {
				this.loading = true;
				console.log(this.searchText);
				this.getUserReposBySearch(this.page, this.per_page, this.searchText);
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
}
