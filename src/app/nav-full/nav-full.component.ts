import { Component, OnInit, Input } from '@angular/core';
import * as superagent from 'superagent';
import { notify } from '../util/util';
import { DataService } from '../services/DisplayEvents/display-data.service';

@Component({
  selector: 'app-nav-full',
  templateUrl: './nav-full.component.html',
  styleUrls: ['./nav-full.component.scss']
})
export class NavFullComponent implements OnInit {
  // reference to parent class function
  @Input() logout: Function;
  @Input() loginUrl: string;
  imageUrl: string;
  logged: boolean;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    // subscripcion a nuevos cambios
    // TODO: pasar la subscripcion a todos los hijos
    this.dataService.logged.subscribe((logged) => {
      this.logged = logged;
    });
    this.dataService.image.subscribe((url) => {
      this.imageUrl = url;
    });
  }

  // dashboard content

  changeDashboardContent(dashboardContent: string) {
    this.dataService.showDashboard(dashboardContent);
  }

  displayRepoList() {
    this.changeDashboardContent(this.dataService.repoList);
  }

}
