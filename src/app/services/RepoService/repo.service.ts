import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { getTokensFromStorage } from 'src/app/util/util';

@Injectable({
	providedIn: 'root'
})
export class RepoService {

	readonly AUTH_SERVICE_URL = environment.authUrl;
	readonly SERVER_SERVICE_URL = environment.serverUrl;

	readonly ALL_REPOS: string = '/repos';
	readonly SEARCH: string = '/repos/search';
	readonly REPO_BY_NAME: string = '/repos/reponame';

	constructor(private http: HttpClient) { }

	public getAllRepos(): Promise<any> {
		
		const {accessToken,githubToken} = getTokensFromStorage();
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
		
		const {accessToken,githubToken} = getTokensFromStorage();
		
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
		return this.http.get(this.SERVER_SERVICE_URL + this.ALL_REPOS, httpOptions).toPromise();
	}

	public getAllReposPagedBySearch(page: string, per_page: string, search: string): Promise<any> {
		
		const {accessToken,githubToken} = getTokensFromStorage();
		
		const username = localStorage.getItem('username') as string;
		const headers = {
			'Content-Type': 'application/json',
			'x-access-token': accessToken,
			'x-github-token': githubToken
		};
		const params: HttpParams = new HttpParams({
			fromObject: {
				page,
				per_page,
				username,
				search
			},
		});
		const httpOptions = {
			headers: new HttpHeaders(headers),
			params,
		};
		return this.http.get(this.SERVER_SERVICE_URL + this.SEARCH, httpOptions).toPromise();

	}

	public getRepoByName(reponame: string): Promise<any> {
		const {accessToken,githubToken} = getTokensFromStorage();
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
