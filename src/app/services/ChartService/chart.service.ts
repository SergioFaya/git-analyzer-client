import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class ChartService {

	readonly AUTH_SERVICE_URL = environment.authUrl;
	readonly SERVER_SERVICE_URL = environment.serverUrl;

	readonly CONTRIBUTORS = '/contributors'
	constructor(private http: HttpClient) { }


	getContributorsForPieChart(reponame: string): Promise<any> {
		const accessToken = localStorage.getItem('accessToken') as string;
		const githubToken = localStorage.getItem('githubToken') as string;
		const headers = {
			'Content-Type': 'application/json',
			'x-access-token': accessToken,
			'x-github-token': githubToken,
			'reponame': reponame,
		};
		const httpOptions = {
			headers: new HttpHeaders(headers)
		};
		return this.http.get(this.SERVER_SERVICE_URL + this.CONTRIBUTORS, httpOptions).toPromise();
	}
}
