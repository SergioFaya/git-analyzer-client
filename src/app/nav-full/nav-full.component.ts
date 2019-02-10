import { Component, OnInit, Input } from '@angular/core';
import * as UIkit from 'uikit';

@Component({
  selector: 'app-nav-full',
  templateUrl: './nav-full.component.html',
  styleUrls: ['./nav-full.component.scss']
})
export class NavFullComponent implements OnInit {
  // reference to parent class function
  @Input() login: Function;
  @Input() loginUrl: string;
  constructor() { }

  ngOnInit() {
  }

}
