import { Component, AfterViewInit, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as UIkit from 'uikit';
import { Observable } from 'rxjs';

import * as superagent from 'superagent';

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

  private access_token: string;
  private github_access_token: string;
  loginUrl: string;

  get accessToken(): string {
    return this.access_token;
  }

  get githubAccessToken(): string {
    return this.github_access_token;
  }

  constructor(private http: HttpClient) { }

  /**
   * Enlaza con la template el método login
   */
  get loginFunc() {
    return this.login.bind(this);
  }

  login() {
    superagent.get(this.AUTH_SERVICE_URL + '/login')
      .set('Accept', 'application/json')
      .then(result => {
        this.loginUrl = result.body.data;
      }).catch(err => {
        this.notify('error )>');
        this.notify(err.message);
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

  private notify(data: string): void {
    UIkit.notification({
      message: data,
      status: 'primary',
      timeout: 5000
    });
  }
}

