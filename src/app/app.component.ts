import { Component, AfterViewInit, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as UIkit from 'uikit';
import { Observable } from 'rxjs';

import { notify } from './util/util';
import * as superagent from 'superagent';
import { DataService } from './services/DisplayEvents/display-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit {
  size: number;
  showLateral: boolean;
  showFull: boolean;

  readonly AUTH_SERVICE_URL = 'http://localhost:3000';
  readonly SERVER_SERVICE_URL = 'http://localhost:3001';

  loginUrl: string;

  constructor(private dataService: DataService) { }

  /**
   * Enlaza con la template el método login
   */
  get loginFunc() {
    return this.login.bind(this);
  }

  get storeTokensFunc() {
    return this.storeTokens.bind(this);
  }

  login() {
    superagent.get(this.AUTH_SERVICE_URL + '/login')
      .set('Accept', 'application/json')
      .then(result => {
        this.loginUrl = result.body.data;
      }).catch(err => {
        notify('error =>');
        notify(err.message);
      });

  }

  ngOnInit(): void {
    this.size = window.innerWidth;
    this.adaptToSize(this.size);
    this.login();
  }

  onResize(event): void {
    this.size = event.target.innerWidth;
    this.adaptToSize(this.size);
  }

  adaptToSize(size: number): void {
    if (size < 960) {
      this.showLateral = true;
      this.showFull = false;
    } else {
      this.showLateral = false;
      this.showFull = true;
    }
  }

  // login cutre temporal

  storeTokens(accessToken: string, githubToken: string) {
    localStorage.setItem('githubToken', githubToken);
    localStorage.setItem('accessToken', accessToken);

    superagent.get('http://localhost:3001/user/info')
      .set('x-access-token', localStorage.getItem('accessToken'))
      .set('x-github-token', localStorage.getItem('githubToken'))
      .then((result: any) => {
        this.dataService.loggedUser(true);
        this.dataService.imageUrlContent(result.body.user.avatarUrl);
        localStorage.setItem('email', result.body.user.email);
        localStorage.setItem('login', result.body.user.login);
        localStorage.setItem('userId', result.body.user.userId);
        notify(`Hola ${result.body.user.login}-${result.body.user.email}`);
      });
  }

}

