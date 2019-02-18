import { Component, OnInit, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { notify } from '../../util/util';
import * as superagent from 'superagent';
import { DataService } from '../../services/DisplayEvents/display-data.service';
import { Chart } from 'chart.js';
import { environment } from '../../../environments/environment';

import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-repo-details',
  templateUrl: './repo-details.component.html',
  styleUrls: ['./repo-details.component.scss']
})
export class RepoDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  repo: any;
  contributors: any;
  labelsPre = [];
  dataPre = [];
  colors = [];

  insertedLines = [];
  removedLines = [];

  canvas: any;
  ctx: any;
  // charts
  myChart: any;
  myChart2: any;
  myChart3: any;

  constructor(private dataService: DataService) {
    this.init();
  }

  // Somewhere under the class constructor we want to wait for our view
  // to initialize
  ngAfterViewInit() {
    // this.getContributors(this.repo.full_name);
  }

  // change get elemet by id por tag #canvas
  ngOnInit() {
    this.colors = [];
    let i = 0;
    while (i < 15) {
      this.colors.push(this.getRandomColor());
      i++;
    }
    this.dataService.repo.subscribe((repo) => {
      this.repo = repo;
      this.init();
      this.getContributors(this.repo.full_name);
    });
  }

  init() {
    this.dataPre = [];
    this.insertedLines = [];
    this.labelsPre = [];
    this.removedLines = [];
    // Destroy elimina el binding con el html
  }

  ngOnDestroy(): void {
    // intentar el binding de angular y sino crear el canvas cada vez
    // que cree el componente y cargarmelo en destroy
    this.colors = null;
    this.myChart.clear();

    this.myChart2.clear();

    this.myChart3.clear();

    this.myChart.destroy();
    this.myChart = null;
    this.myChart2.destroy();
    this.myChart2 = null;
    this.myChart3.destroy();
    this.myChart3 = null;
    this.myChart.destroy();

    this.myChart2.destroy();

    this.myChart3.destroy();

  }

  representChart() {
    // then destory the old one so we can create a new one later
    if (this.myChart) {
      this.myChart.destroy();
    }
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.myChart = new Chart(this.ctx, {
      type: 'pie',
      data: {
        labels: this.labelsPre,
        datasets: [{
          label: '# of Commits',
          data: this.dataPre,
          backgroundColor: this.colors,
          borderWidth: 1,
        }]
      },
      options: {
        responsive: false,
        display: true,
        title: {
          display: true,
          text: 'Commits'
        }
      }
    });
  }

  representChart2() {
    if (this.myChart2) {
      this.myChart2.destroy();
    }
    this.canvas = document.getElementById('added');
    this.ctx = this.canvas.getContext('2d');
    this.myChart2 = new Chart(this.ctx, {
      type: 'pie',
      data: {
        labels: this.labelsPre,
        datasets: [{
          label: '# of Commits',
          data: this.insertedLines,
          backgroundColor: this.colors,
          borderWidth: 1,
        }]
      },
      options: {
        responsive: false,
        display: true,
        title: {
          display: true,
          text: 'Added Lines'
        }
      }
    });
  }
  representChart3() {
    if (this.myChart3) {
      this.myChart3.destroy();
    }
    this.canvas = document.getElementById('deleted');
    this.ctx = this.canvas.getContext('2d');
    this.myChart3 = new Chart(this.ctx, {
      type: 'pie',
      data: {
        labels: this.labelsPre,
        datasets: [{
          label: '# of Commits',
          data: this.removedLines,
          backgroundColor: this.colors,
          borderWidth: 1,
        }]
      },
      options: {
        responsive: false,
        display: true,
        title: {
          display: true,
          text: 'Removed lines'
        }
      }
    });
  }
  getRandomColor() {
    const r = Math.floor(Math.random() * 200);
    const g = Math.floor(Math.random() * 200);
    const b = Math.floor(Math.random() * 200);
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
  }

  getContributors(reponame: string) {
    superagent
      .get(environment.serverUrl + '/contributors')
      .set('x-access-token', localStorage.getItem('accessToken'))
      .set('x-github-token', localStorage.getItem('githubToken'))
      .set('reponame', reponame)
      .then((result) => {
        this.contributors = result.body.contributors;
        this.contributors.map((x: any) => {
          this.dataPre.push(x.modifications.c);
          this.insertedLines.push(x.modifications.a);
          this.removedLines.push(x.modifications.d);
          this.labelsPre.push(x.login);
        });
      }).then(() => {
        this.representChart();
        this.representChart2();
        this.representChart3();
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

