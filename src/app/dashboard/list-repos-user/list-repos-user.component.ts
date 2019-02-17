import { Component, OnInit } from '@angular/core';
import { notify } from '../../util/util';
import * as superagent from 'superagent';
import { DataService } from '../../services/DisplayEvents/display-data.service';
@Component({
  selector: 'app-list-repos-user',
  templateUrl: './list-repos-user.component.html',
  styleUrls: ['./list-repos-user.component.scss']
})
export class ListReposUserComponent implements OnInit {

  public alertText: string;
  public repos: Array<any>;
  repoDetailed: any;

  constructor(private dataService: DataService) { }

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
        this.repos = result.body.repos;
      }).catch((err) => {
        console.log(err);
      });
  }

  getUserRepoByName(reponame: string) {
    superagent
      .get('http://localhost:3001/repos/reponame')
      .set('x-access-token', localStorage.getItem('accessToken'))
      .set('x-github-token', localStorage.getItem('githubToken'))
      // find by full_name que cuando es de otro y lo tienes forqueao o eres colaborador no tira
      // .set('username', localStorage.getItem('login'))
      .set('reponame', reponame)
      .then((result) => {
        this.repoDetailed = result.body.repo;
        // separar comportamiento en el otro component
        this.dataService.detailedRepo(this.repoDetailed);
        this.dataService.showDashboard(this.dataService.repoDetailed);
      }).catch((err) => {
        console.log(err);
      });
  }
}
