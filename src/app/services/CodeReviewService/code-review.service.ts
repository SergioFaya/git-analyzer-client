import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import ICodeReview from '../../models/ICodeReview';


@Injectable({
	providedIn: 'root'
})
export class CodeReviewService {

	readonly AUTH_SERVICE_URL = environment.authUrl;
	readonly SERVER_SERVICE_URL = environment.serverUrl;

	readonly FIND_ALL = '/codeReview/list';
	readonly CREATE = 'findAll';
	readonly UPDATE = 'findAll';
	readonly DELETE = 'findAll';


	constructor(private http: HttpClient) { }

	private accessToken = localStorage.getItem('accessToken') as string;
	// private githubToken = localStorage.getItem('githubToken') as string;

	findAll() {
		const headers = {
			'Content-Type': 'application/json',
			'x-access-token': this.accessToken,
			//'x-github-token': this.githubToken,
		};
		const httpOptions = {
			headers: new HttpHeaders(headers)
		};
		return this.http.get(this.SERVER_SERVICE_URL + this.FIND_ALL, httpOptions).toPromise();
	}

	newCodeReview(review: ICodeReview) {
		const headers = {
			'Content-Type': 'application/json',
			'x-access-token': this.accessToken,
		};
		const params = new HttpParams();
		params.append('review', review.toString())
		const httpOptions = {
			headers: new HttpHeaders(headers),
			params: new HttpParams
		};
		return this.http.get(this.SERVER_SERVICE_URL + this.FIND_ALL, httpOptions).toPromise();
	}
}
