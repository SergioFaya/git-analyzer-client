import { Component, OnInit, Input } from '@angular/core';
import * as superagent from 'superagent';
import { notify } from '../util/util';

@Component({
  selector: 'app-nav-full',
  templateUrl: './nav-full.component.html',
  styleUrls: ['./nav-full.component.scss']
})
export class NavFullComponent implements OnInit {
  // reference to parent class function
  @Input() login: Function;
  @Input() loginUrl: string;

  public imageUrl: string;
  public logged: boolean;

  githubToken: string;
  accessToken: string;

  constructor() { }

  ngOnInit() {
  }

  storeTokens() {
    localStorage.setItem('githubToken', this.githubToken);
    localStorage.setItem('accessToken', this.accessToken);

    superagent.get('http://localhost:3001/user/info')
      .set('x-access-token', localStorage.getItem('accessToken'))
      .set('x-github-token', localStorage.getItem('githubToken'))
      .then((result: any) => {
        this.imageUrl = result.body.user.avatarUrl;
        this.logged = true;
        localStorage.setItem('imageUrl', result.body.user.avatarUrl);
        localStorage.setItem('email', result.body.user.email);
        localStorage.setItem('login', result.body.user.login);
        localStorage.setItem('userId', result.body.user.userId);
        notify(`Hola ${result.body.user.login}-${result.body.user.email}`);
      });
  }

}
