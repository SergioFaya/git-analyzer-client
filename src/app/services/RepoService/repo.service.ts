import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class RepoService {

	readonly AUTH_SERVICE_URL = environment.authUrl;
	readonly SERVER_SERVICE_URL = environment.serverUrl;

	readonly ALL_REPOS: string = '/repos';
	readonly REPO_BY_NAME: string = '/repos/reponame';

	constructor(private http: HttpClient) { }

	public getAllRepos(): Promise<any> {
		const accessToken = localStorage.getItem('accessToken') as string;
		const githubToken = localStorage.getItem('githubToken') as string;
		const headers = {
			'Content-Type': 'application/json',
			'x-access-token': accessToken,
			'x-github-token': githubToken
		};
		const httpOptions = {
			headers: new HttpHeaders(headers)
		};
		return this.http.get(this.SERVER_SERVICE_URL + this.ALL_REPOS, httpOptions).toPromise();
	}

	public getAllReposPaged(page: string, per_page: string): Promise<any> {
		const accessToken = localStorage.getItem('accessToken') as string;
		const githubToken = localStorage.getItem('githubToken') as string;
		const headers = {
			'Content-Type': 'application/json',
			'x-access-token': accessToken,
			'x-github-token': githubToken
		};
		const params: HttpParams = new HttpParams({
			fromObject: {
				page,
				per_page,
			},
		});
		const httpOptions = {
			headers: new HttpHeaders(headers),
			params,
		};
		console.log(page,per_page);
		return this.http.get(this.SERVER_SERVICE_URL + this.ALL_REPOS, httpOptions).toPromise();
	}

	public getRepoByName(reponame: string): Promise<any> {
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
		return this.http.get(this.SERVER_SERVICE_URL + this.REPO_BY_NAME, httpOptions).toPromise();
	}
}
