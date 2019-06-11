import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { getTokensFromStorage } from '../../util/util';

@Injectable({
	providedIn: 'root'
})
export class ChartService {

	readonly AUTH_SERVICE_URL = environment.authUrl;
	readonly SERVER_SERVICE_URL = environment.serverUrl;

	readonly CONTRIBUTORS = '/contributors'
	readonly GIT_CHART = '/chart/gitTree';

	constructor(private http: HttpClient) { }

	getContributorsForPieChart(reponame: string): Promise<any> {
		const { accessToken, githubToken } = getTokensFromStorage();
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

	getParsedDataForGitGraph(username: string, reponame: string): Promise<any> {
		const { accessToken, githubToken } = getTokensFromStorage();
		const headers = {
			'Content-Type': 'application/json',
			'x-access-token': accessToken,
			'x-github-token': githubToken,
			'username': username,
			'reponame': reponame,
		};
		const httpOptions = {
			headers: new HttpHeaders(headers)
		};
		return this.http.get(this.SERVER_SERVICE_URL + this.GIT_CHART, httpOptions).toPromise();
	}
}
