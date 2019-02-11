import { Component, OnInit } from '@angular/core';
import * as UIkit from 'uikit';
import * as superagent from 'superagent';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  imageUrl: string;
  public alertText: string;
  constructor() { }

  ngOnInit() {

  }

  sendData() {
    superagent.get('http://localhost:3001/user/info')
    .set('x-access-token', localStorage.getItem('accessToken'))
    .set('x-github-token', localStorage.getItem('githubToken'))
    .then((result: any) => {
        this.alertText = result.body.user;
        this.imageUrl = result.body.user.avatarUrl;
    });
  }


}