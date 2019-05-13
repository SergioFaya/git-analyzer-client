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
	readonly GIT_GRAPH = '/charts/gitTree';

	constructor(private http: HttpClient) { }

	private accessToken = localStorage.getItem('accessToken') as string;
	private githubToken = localStorage.getItem('githubToken') as string;

	getContributorsForPieChart(reponame: string): Promise<any> {

		const headers = {
			'Content-Type': 'application/json',
			'x-access-token': this.accessToken,
			'x-github-token': this.githubToken,
			'reponame': reponame,
		};
		const httpOptions = {
			headers: new HttpHeaders(headers)
		};
		return this.http.get(this.SERVER_SERVICE_URL + this.CONTRIBUTORS, httpOptions).toPromise();
	}

	getParsedDataForGitGraph(reponame: string): Promise<any> {
		const headers = {
			'Content-Type': 'application/json',
			'x-access-token': this.accessToken,
			'x-github-token': this.githubToken,
			//'username': username,
			'reponame': reponame,
		};
		const httpOptions = {
			headers: new HttpHeaders(headers)
		};
		return this.http.get(this.SERVER_SERVICE_URL + this.GIT_GRAPH, httpOptions).toPromise();
	}
}
