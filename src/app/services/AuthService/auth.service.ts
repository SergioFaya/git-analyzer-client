import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getTokensFromStorage } from 'src/app/util/util';
import { environment } from '../../../environments/environment';


@Injectable({
	providedIn: 'root'
})
export class AuthService {

	readonly AUTH_SERVICE_URL = environment.authUrl;
	readonly SERVER_SERVICE_URL = environment.serverUrl;

	readonly LOGOUT_ADDRESS: string = '/logout';
	readonly LOGIN_ADDRESS: string = '/login';
	readonly USER_INFO: string = '/user/info';
	readonly LOGIN_CHECK: string = '/login/check';


	constructor(private http: HttpClient) { }

	checkLogin() {
		const { accessToken } = getTokensFromStorage();
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'x-access-token': accessToken,
			})
		}
		return this.http.get(this.AUTH_SERVICE_URL + this.LOGIN_CHECK, httpOptions).toPromise();
	}

	logOut() {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
			})
		}
		const { accessToken } = getTokensFromStorage();
		const body = { 'x-access-token': accessToken };
		return this.http.post(this.AUTH_SERVICE_URL + this.LOGOUT_ADDRESS, body, httpOptions).toPromise();
	}

	getLoginUrl() {
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' })
		};
		return this.http.get(this.AUTH_SERVICE_URL + this.LOGIN_ADDRESS, httpOptions).toPromise();
	}

	getUserInfo(): Promise<any> {
		const { accessToken, githubToken } = getTokensFromStorage();
		const headers = {
			'Content-Type': 'application/json',
			'x-access-token': accessToken,
			'x-github-token': githubToken
		};
		const httpOptions = {
			headers: new HttpHeaders(headers)
		};
		return this.http.get(this.SERVER_SERVICE_URL + this.USER_INFO, httpOptions).toPromise();
	}

}
