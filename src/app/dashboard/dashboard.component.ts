import { Component, OnInit } from '@angular/core';
import * as request from 'superagent';
import * as UIkit from 'uikit';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  public items = [1, 2, 3, 4, 5, 6, 7];
  public owner: string;
  public repo: string;
  public alertText: string;
  constructor() { }

  ngOnInit() {
  }

  sendData() {
    this.items = [3, 2, 1];
    UIkit.notification('My message');
    this.alertText = 'Alert xd';
    UIkit.alert('#alert');
  }


}