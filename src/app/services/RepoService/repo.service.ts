import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDecoratedCommit } from 'git-analyzer-types';
import { getTokensFromStorage, getUserDataFromLocalStorage } from 'src/app/util/util';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class RepoService {

	readonly AUTH_SERVICE_URL = environment.authUrl;
	readonly SERVER_SERVICE_URL = environment.serverUrl;

	readonly ALL_REPOS: string = '/repos';
	readonly SEARCH: string = '/repos/search';
	readonly REPO_BY_NAME: string = '/repos/reponame';

	readonly COMMITS: string = '/commits';

	constructor(private http: HttpClient) { }

	public getAllRepos(): Promise<any> {

		const username = getUserDataFromLocalStorage().username as string;
		const { accessToken, githubToken } = getTokensFromStorage();
		const headers = {
			'Content-Type': 'application/json',
			'x-access-token': accessToken,
			'x-github-token': githubToken,
			'username': username
		};
		const httpOptions = {
			headers: new HttpHeaders(headers)
		};
		return this.http.get(this.SERVER_SERVICE_URL + this.ALL_REPOS, httpOptions).toPromise();
	}

	public getAllReposPaged(page: string, per_page: string): Promise<any> {

		const { accessToken, githubToken } = getTokensFromStorage();

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

	public getAllReposPagedBySearch(search: string, username?: string): Promise<any> {

		const { accessToken, githubToken } = getTokensFromStorage();
		var name;
		if (username) {
			name = username;
		} else {
			name = localStorage.getItem('username') as string;
		}

		const headers = {
			'Content-Type': 'application/json',
			'x-access-token': accessToken,
			'x-github-token': githubToken
		};
		const params: HttpParams = new HttpParams({
			fromObject: {
				name,
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
		return this.http.get(this.SERVER_SERVICE_URL + this.REPO_BY_NAME, httpOptions).toPromise();
	}

	public getCommitOfRepo(reponame: string, commitSha: string) {
		const { accessToken, githubToken } = getTokensFromStorage();
		const headers = {
			'Content-Type': 'application/json',
			'x-access-token': accessToken,
			'x-github-token': githubToken,
			'reponame': reponame,
			'sha': commitSha
		};
		const httpOptions = {
			headers: new HttpHeaders(headers)
		};
		return this.http.get<IDecoratedCommit>(this.SERVER_SERVICE_URL + this.COMMITS, httpOptions).toPromise();
	}
}
