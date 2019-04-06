import { Component, OnInit } from '@angular/core';
import * as superagent from 'superagent';
import { environment } from '../.,/../../../environments/environment';
import { DataService } from '../../services/DisplayEvents/display-data.service';
import { notify } from '../../util/util';
@Component({
  selector: 'app-list-repos-user',
  templateUrl: './list-repos-user.component.html',
  styleUrls: ['./list-repos-user.component.scss']
})
export class ListReposUserComponent implements OnInit {

  public alertText!: string;
  public repos!: Array<any>;
  repoDetailed: any;

  loading = false;
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.loading = true;
    this.getUserRepos();
  }

  private getUserRepos() {
    this.alertText = 'List of repositories:';
    superagent
      .get(environment.serverUrl + '/repos')
      .set('x-access-token', localStorage.getItem('accessToken') as string)
      .set('x-github-token', localStorage.getItem('githubToken') as string)
      .then((result) => {
        this.repos = result.body.repos;
      }).then(() => {
        this.loading = false;
      }).catch((err) => {
        console.log(err);
        notify('Crea nuevos tokens');
        this.dataService.loggedUser(false);
      });
  }

  getUserRepoByName(reponame: string) {
    superagent
      .get(environment.serverUrl + '/repos/reponame')
      .set('x-access-token', localStorage.getItem('accessToken') as string)
      .set('x-github-token', localStorage.getItem('githubToken') as string)
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
