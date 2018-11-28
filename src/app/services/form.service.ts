import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as request from 'superagent';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class FormService {
  results: Object[];
  constructor(private http: HttpClient) {
    this.results = [];
  }

  getCommitsOfRepo(owner: string, repo: string) {
    const body = {
      owner: owner,
      repo: repo
    };
    // return this.http.post('localhost:3000/form', body);
    //return this.http.post('https://api.github.com/repos/octokit/octokit.rb', body);
    return request.get('https://api.github.com/repos/octokit/octokit.rb');
  }
}
