import { Component, OnInit } from '@angular/core';
import Repo from '../../models/Repo';
import { DataService } from '../../services/DisplayEvents/display-data.service';
import { RepoService } from '../../services/RepoService/repo.service';
import { notify } from '../../util/util';
@Component({
	selector: 'app-list-repos-user',
	templateUrl: './list-repos-user.component.html',
	styleUrls: ['./list-repos-user.component.scss']
})
export class ListReposUserComponent implements OnInit {

	public repos!: Array<Repo>;
	repoDetailed: any;
	readonly PER_PAGE = 5;
	public page = 1;

	loading = false;
	constructor(private dataService: DataService, private repoService: RepoService) { }

	ngOnInit() {
		this.loading = true;
		this.loadPage(this.page);
	}

	private getUserRepos(page?: number, per_page?: number) {
		this.repos = [];
		this.repoService.getAllReposPaged(page+'',per_page+'').then(
			(result) => {
				this.loading = false;
				this.repos = result.repos;
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
				this.dataService.showDashboard(this.dataService.repoDetailed);
			}).catch((err) => {
				console.log(err);
				notify('Error en listado: Vuelve a loggearte o prueba más tarde');
				this.dataService.loggedUser(false);
			});
	}

	loadPage(step: number) {
		this.page += step;
		this.getUserRepos(this.page,this.PER_PAGE);
	}
}
