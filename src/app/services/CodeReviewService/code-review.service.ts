import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICodeReview, IRepo } from 'git-analyzer-types';
import { getTokensFromStorage, getUserDataFromLocalStorage } from 'src/app/util/util';
import { environment } from '../../../environments/environment';


@Injectable({
	providedIn: 'root'
})
export class CodeReviewService {

	readonly AUTH_SERVICE_URL = environment.authUrl;
	readonly SERVER_SERVICE_URL = environment.serverUrl;

	readonly FIND_ALL = '/codeReview/list';
	readonly SEARCH = '/codeReview/list/search';

	readonly CREATE = '/codeReview/create';
	readonly DELETE = '/codeReview/delete';


	constructor(private http: HttpClient) { }

	findAll() {
		const { accessToken } = getTokensFromStorage();
		const username = getUserDataFromLocalStorage().login;
		const headers = {
			'Content-Type': 'application/json',
			'x-access-token': accessToken,
			'username': username!
		};
		const httpOptions = {
			headers: new HttpHeaders(headers)
		};
		return this.http.get<Array<ICodeReview>>(this.SERVER_SERVICE_URL + this.FIND_ALL, httpOptions).toPromise();
	}

	search(search: string) {
		const { accessToken } = getTokensFromStorage();
		const username = getUserDataFromLocalStorage().login;
		const headers = {
			'Content-Type': 'application/json',
			'x-access-token': accessToken,
			'username': username!,
			'search': search,
		};
		const httpOptions = {
			headers: new HttpHeaders(headers)
		};
		return this.http.get<Array<ICodeReview>>(this.SERVER_SERVICE_URL + this.SEARCH, httpOptions).toPromise();
	}

	newCodeReview(review: ICodeReview) {
		const { accessToken } = getTokensFromStorage();

		const params = {
			'review': JSON.stringify(review),
			'x-access-token': accessToken
		}
		return this.http.post(this.SERVER_SERVICE_URL + this.CREATE, params).toPromise();
	}

	deleteCodeReview(reviewId: ICodeReview) {
		const { accessToken } = getTokensFromStorage();

		const params = {
			'reviewId': reviewId,
			'x-access-token': accessToken
		}
		return this.http.post(this.SERVER_SERVICE_URL + this.DELETE, params).toPromise();
	}


	createIssueForCodeReview(review: ICodeReview) {
		const { githubToken } = getTokensFromStorage();
		const repo = review.repository as IRepo;
		const body = {
			'title': review.title,
			'body': review.commentary,
			'labels': ['Review Calification ' + review.calification]
		}
		const headers = {
			'Authorization': 'token ' + githubToken
		};
		return this.http.post(`https://api.github.com/repos/${repo.full_name}/issues`, body, { headers: headers }).toPromise();
	}
}
