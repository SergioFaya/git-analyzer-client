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
	//'<svg width="155" height="30"> <defs> <linearGradient id="gradient-157445042" x1="0" x2="0" y1="1" y2="0"> <stop offset="10%" stop-color="#c6e48b"></stop> <stop offset="33%" stop-color="#7bc96f"></stop> <stop offset="66%" stop-color="#239a3b"></stop> <stop offset="90%" stop-color="#196127"></stop> </linearGradient> <mask id="sparkline-157445042" x="0" y="0" width="155" height="28"> <polyline transform="translate(0, 28) scale(1,-1)" points="0,1 3,1 6,1 9,1 12,1 15,1 18,1 21,1 24,1 27,1 30,1 33,1 36,1 39,1 42,1 45,1 48,1 51,1 54,1 57,1 60,1 63,1 66,2 69,4 72,2 75,1 78,1 81,1 84,1 87,1 90,1 93,1 96,1 99,1 102,2 105,6 108,2 111,1 114,1 117,7 120,2 123,4 126,7 129,4 132,1 135,1 138,2 141,1 144,2 147,2 150,2 153,4 " fill="transparent" stroke="#8cc665" stroke-width="2"> </polyline></mask> </defs> <g transform="translate(0, -9)"> <rect x="0" y="-2" width="155" height="30" style="stroke: none; fill: url(#gradient-157445042); mask: url(#sparkline-157445042)"></rect> </g> </svg>';

	// search keyup keydown control 
	private typingTimer: any;
	private doneTypingInterval = 2000;

	constructor(
		private dataService: DisplayDashboardService,
		private repoService: RepoService) { }

	ngOnInit() {
		this.loading = true;
		this.getUserRepos(this.page, this.per_page);
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

	// utilities

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
}
