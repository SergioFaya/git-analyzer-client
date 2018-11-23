import { Component, AfterViewInit, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  size: number;
  showLateral: boolean;
  showFull: boolean;

  constructor() {}

  ngOnInit(): void {
    this.size = window.innerWidth;
    this.adaptToSize(this.size);
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
}

