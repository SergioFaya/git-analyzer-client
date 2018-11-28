import { Component, OnInit } from '@angular/core';
import { FormService } from '../services/form.service';
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
  constructor(private formService: FormService) { }

  ngOnInit() {
  }

  sendData() {
    this.items = [3, 2, 1];
    // UIkit.notification('My message');
    // this.alertText = 'Alert xd';
    // UIkit.alert('#alert');
    if (!this.owner || !this.repo) {
      UIkit.notification({
        message: 'Empty fields on form',
        status: 'primary',
        timeout: 5000
      });
      return;
    }
    this.formService.getCommitsOfRepo(this.owner, this.repo)
      .then((data) => {
        UIkit.notification({
          message: 'Then: ' + data.body,
          status: 'primary',
          timeout: 5000
        });
      }).catch((err) => {
        UIkit.notification({
          message: 'Err: ' + err.message,
          status: 'primary',
          timeout: 5000
        });
      });
  }


}