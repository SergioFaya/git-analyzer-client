import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly AUTH_SERVICE_URL = environment.authUrl;
  readonly SERVER_SERVICE_URL = environment.serverUrl;

  readonly LOGIN_ADDRESS: string = '/login';
  readonly USER_INFO: string = '/user/info';

  private githubToken;
  private serverToken;

  constructor(private http: HttpClient) { }

  setGithubToken(githubToken: string) {
    this.githubToken = githubToken;
  }

  setServerToken(serverToken: string) {
    this.serverToken = serverToken;
  }

  getGithubToken(): string {
    return this.githubToken;
  }

  getServerToken(): string {
    return this.serverToken;
  }

  getLoginUrl() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.get(this.AUTH_SERVICE_URL + this.LOGIN_ADDRESS, httpOptions);
  }

  getUserInfo() {
    const headers = {
      'Content-Type': 'application/json',
      'x-access-token': this.serverToken,
      'x-github-token': this.githubToken
    };
    const httpOptions = {
      headers: new HttpHeaders(headers)
    };
    return this.http.get(this.SERVER_SERVICE_URL + this.USER_INFO, httpOptions);
  }

  storeTokens(accessToken: string, githubToken: string) {
    localStorage.setItem('githubToken', githubToken);
    localStorage.setItem('accessToken', accessToken);

    superagent.get(this.SERVER_SERVICE_URL + this.USER_INFO)
      .set('x-access-token', localStorage.getItem('accessToken'))
      .set('x-github-token', localStorage.getItem('githubToken'))
      .then((result: any) => {
        this.dataService.loggedUser(true);
        this.dataService.imageUrlContent(result.body.user.avatarUrl);
        localStorage.setItem('email', result.body.user.email);
        localStorage.setItem('login', result.body.user.login);
        localStorage.setItem('userId', result.body.user.userId);
        notify(`Hola ${result.body.user.login}-${result.body.user.email}`);
      });
  }
}
