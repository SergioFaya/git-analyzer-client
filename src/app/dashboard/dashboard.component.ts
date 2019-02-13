import { Component, OnInit, Input } from '@angular/core';
import * as UIkit from 'uikit';
import { notify } from '../util/util';
import * as superagent from 'superagent';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  public alertText: string;
  public datos: Array<any>;
  constructor() { }

  ngOnInit() {
    this.getReposOfInstallation();
  }

  private getReposOfInstallation() {
    superagent
      .get('http://localhost:3001/repos')
      .set('x-access-token', localStorage.getItem('accessToken'))
      .set('x-github-token', localStorage.getItem('githubToken'))
      .then((result) => {
        this.datos = result.body.repos;
      }).catch((err) => {
        console.log(err);
      });
  }


}