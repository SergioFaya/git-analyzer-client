import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private currentDashboardContent = new BehaviorSubject('');
  content = this.currentDashboardContent.asObservable();

  // revisar - ta puesto rapido hecho una mierda
  private repoDetailedContent = new BehaviorSubject(null);
  repo = this.repoDetailedContent.asObservable();

  private isloggedUser = new BehaviorSubject(false);
  logged = this.isloggedUser.asObservable();

  private imageUrl = new BehaviorSubject('');
  image = this.imageUrl.asObservable();
  // keys to defin which part of the dashboard show
  public repoList = 'repoList';
  public repoDetailed = 'repoDetailed';

  constructor() { }

  showDashboard(key: string) {
    this.currentDashboardContent.next(key);
    localStorage.setItem('dashboard', key);
  }

  detailedRepo(repo: string) {
    this.repoDetailedContent.next(repo);
    // localStorage.setItem('repoDetailed', repo);
  }

  loggedUser(logged: boolean) {
    this.isloggedUser.next(logged);
    localStorage.setItem('logged', 'logged');
  }

  imageUrlContent(url: string) {
    this.imageUrl.next(url);
    localStorage.setItem('imageUrl', url);
  }

}