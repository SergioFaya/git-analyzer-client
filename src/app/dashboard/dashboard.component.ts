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
  public listReposDisabled: boolean;
  constructor() { }

  ngOnInit() {
    this.listReposDisabled = false;
  }

}