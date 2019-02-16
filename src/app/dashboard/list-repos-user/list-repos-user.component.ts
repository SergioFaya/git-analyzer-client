import { Component, OnInit } from '@angular/core';
import { notify } from '../../util/util';
import * as superagent from 'superagent';
@Component({
  selector: 'app-list-repos-user',
  templateUrl: './list-repos-user.component.html',
  styleUrls: ['./list-repos-user.component.scss']
})
export class ListReposUserComponent implements OnInit {

  public alertText: string;
  public datos: Array<any>;
  constructor() { }

  ngOnInit() {
    this.getUserRepos();
  }

  private getUserRepos() {
    this.alertText = 'List of repositories:';
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

  private getUserRepoByName(reponame: string) {
    superagent
      .get('http://localhost:3001/repos/reponame')
      .set('x-access-token', localStorage.getItem('accessToken'))
      .set('x-github-token', localStorage.getItem('githubToken'))
      .set('username', localStorage.getItem('login'))
      .set('reponame', reponame)
      .then((result) => {
        this.datos = result.body.repo;
      }).catch((err) => {
        console.log(err);
      });
  }
}
