import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IOrg, IRepo } from 'git-analyzer-types';
import { environment } from '../../../environments/environment';
import { getTokensFromStorage, getUserDataFromLocalStorage } from '../../util/util';

@Injectable({
	providedIn: 'root'
})
export class OrganizationService {

	readonly AUTH_SERVICE_URL = environment.authUrl;
	readonly SERVER_SERVICE_URL = environment.serverUrl;

	readonly USER_ORGS = '/user/organizations';
	readonly USER_ORGS_REPOS = '/user/organizations/repos';

	constructor(private http: HttpClient) { }

	public findUserOrgs(): Promise<Array<IOrg>> {
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
		return this.http.get<Array<IOrg>>(this.SERVER_SERVICE_URL + this.USER_ORGS, httpOptions).toPromise();
	}

	public findOrgRepos(orgname: string, page: string, per_page: string): Promise<Array<IRepo>> {
		const { accessToken, githubToken } = getTokensFromStorage();
		const headers = {
			'Content-Type': 'application/json',
			'x-access-token': accessToken,
			'x-github-token': githubToken,
			'orgname': orgname,
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
		return this.http.get<Array<IRepo>>(this.SERVER_SERVICE_URL + this.USER_ORGS_REPOS, httpOptions).toPromise();
	}

}
