import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Iissue } from 'git-analyzer-types';
import { environment } from '../../../environments/environment';
import { getTokensFromStorage, getUserDataFromLocalStorage } from '../../util/util';

@Injectable({
	providedIn: 'root'
})
export class RecentActivityService {

	readonly SERVER_SERVICE_URL = environment.serverUrl;

	readonly LATEST_ISSUES = '/issues/latest';

	constructor(private http: HttpClient) { }

	findRecentIssues() {
		const { accessToken } = getTokensFromStorage();
		const username = getUserDataFromLocalStorage().username as string;

		const headers = {
			'Content-Type': 'application/json',
			'x-access-token': accessToken,
			'username': username
		};
		const httpOptions = {
			headers: new HttpHeaders(headers)
		};

		return this.http.get<Array<Iissue>>(this.SERVER_SERVICE_URL + this.LATEST_ISSUES, httpOptions).toPromise<Array<Iissue>>();
	}
}
