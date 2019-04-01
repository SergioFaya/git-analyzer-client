import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
	providedIn: 'root'
})
export class AuthService {

	readonly AUTH_SERVICE_URL = environment.authUrl;
	readonly SERVER_SERVICE_URL = environment.serverUrl;

	readonly LOGOUT_ADDRESS: string = '/logout';
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

	logOut() {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
			})
		}
		const body = { 'x-access-token': localStorage.getItem('accessToken') };

		return this.http.post(this.AUTH_SERVICE_URL + this.LOGOUT_ADDRESS, body, httpOptions).toPromise();
	}
	getLoginUrl() {
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' })
		};
		// TODO: meter las rutas de la api en un fichero de configuración
		return this.http.get(this.AUTH_SERVICE_URL + this.LOGIN_ADDRESS, httpOptions).toPromise();
	}

	// TODO: llamarla para pillar la foto y la info básica
	getUserInfo() {
		const headers = {
			'Content-Type': 'application/json',
			'x-access-token': this.serverToken,
			'x-github-token': this.githubToken
		};
		const httpOptions = {
			headers: new HttpHeaders(headers)
		};
		return this.http.get(this.SERVER_SERVICE_URL + this.USER_INFO, httpOptions).toPromise();
	}


}
