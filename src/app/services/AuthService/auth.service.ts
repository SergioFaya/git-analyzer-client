import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { getTokensFromStorage } from 'src/app/util/util';
import { Keys } from 'src/app/models/Keys';


@Injectable({
	providedIn: 'root'
})
export class AuthService {

	readonly AUTH_SERVICE_URL = environment.authUrl;
	readonly SERVER_SERVICE_URL = environment.serverUrl;

	readonly LOGOUT_ADDRESS: string = '/logout';
	readonly LOGIN_ADDRESS: string = '/login';
	readonly USER_INFO: string = '/user/info';

	constructor(private http: HttpClient) { }

	logOut() {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
			})
		}
		const body = { 'x-access-token': localStorage.getItem(Keys.ACCESS_TOKEN) };
		return this.http.post(this.AUTH_SERVICE_URL + this.LOGOUT_ADDRESS, body, httpOptions).toPromise();
	}

	getLoginUrl() {
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' })
		};
		return this.http.get(this.AUTH_SERVICE_URL + this.LOGIN_ADDRESS, httpOptions).toPromise();
	}

	// TODO: llamarla para pillar la foto y la info básica
	getUserInfo(): Promise<any> {
		const {accessToken,githubToken} = getTokensFromStorage();
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
