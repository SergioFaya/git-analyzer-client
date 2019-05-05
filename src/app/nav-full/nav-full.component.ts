import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../services/DisplayEvents/display-data.service';

@Component({
	selector: 'app-nav-full',
	templateUrl: './nav-full.component.html',
	styleUrls: ['./nav-full.component.scss']
})
export class NavFullComponent implements OnInit {

	// reference to parent class function
	@Input() logout!: Function;
	@Input() loginUrl!: string;
	imageUrl!: string;
	logged!: boolean;

	constructor(private dataService: DataService) { }

	ngOnInit() {
		this.logged = localStorage.getItem('logged') == 'logged';
		this.dataService.logged.subscribe((logged) => {
			this.logged = localStorage.getItem('logged') == 'logged';
		});
		this.imageUrl = localStorage.getItem('avatarUrl') as string;
		this.dataService.image.subscribe((url) => {
			this.imageUrl = localStorage.getItem('avatarUrl') as string;
		});
	}

	displayRepoList() {
		this.dataService.showDashboard(DataService.repoList);
	}

	displayOrganizations() {
		this.dataService.showDashboard(DataService.orgsList);
	}

}
