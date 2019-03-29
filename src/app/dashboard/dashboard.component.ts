import { Component, OnInit, Input } from '@angular/core';
import * as UIkit from 'uikit';
import { notify } from '../util/util';
import * as superagent from 'superagent';
import { DataService } from '../services/DisplayEvents/display-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  
  public showTokenForm: boolean;
  public showRepos: boolean;
  public showDetailedRepo: boolean;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.content.subscribe((content) => {
      if (content === this.dataService.repoList.toString()) {
        this.showRepos = true;
        this.showDetailedRepo = false;
      } else if (content === this.dataService.repoDetailed.toString()) {
        this.showRepos = false;
        this.showDetailedRepo = true;
      }
    });
  }

}