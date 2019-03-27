import { Component, AfterViewInit, OnInit } from '@angular/core';
import { notify } from './util/util';
import * as superagent from 'superagent';
import { DataService } from './services/DisplayEvents/display-data.service';
import { environment } from '../environments/environment';
import { AuthService } from './services/AuthService/auth.service';

import * as socketIo from 'socket.io-client';
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit {
	private socket;
	size: number;
	showLateral: boolean;
	showFull: boolean;

	readonly AUTH_SERVICE_URL = environment.authUrl;
	readonly SERVER_SERVICE_URL = environment.serverUrl;

	loginUrl: string;

	constructor(private dataService: DataService, private authService: AuthService) { }

	get storeTokensFunc() {
		return this.storeTokens.bind(this);
	}

	ngOnInit(): void {
		this.size = window.innerWidth;
		this.adaptToSize(this.size);
		this.authService.getLoginUrl()
			.then((response: any) => {
				this.loginUrl = response.data;
				this.initSocket();
			}).catch(err => new Error(err));
	}

	public initSocket(): void {
		this.socket = socketIo('http://localhost:3000');
	}

	public send(message: string): void {
		this.socket.emit('message', message);
	}


	onResize(event): void {
		this.size = event.target.innerWidth;
		this.adaptToSize(this.size);
	}

	private adaptToSize(size: number): void {
		if (size < 960) {
			this.showLateral = true;
			this.showFull = false;
		} else {
			this.showLateral = false;
			this.showFull = true;
		}
	}

	// login cutre temporal
	storeTokens(accessToken: string, githubToken: string) {
		localStorage.setItem('githubToken', githubToken);
		localStorage.setItem('accessToken', accessToken);

		superagent.get(this.SERVER_SERVICE_URL + '/user/info')
			.set('x-access-token', localStorage.getItem('accessToken'))
			.set('x-github-token', localStorage.getItem('githubToken'))
			.then((result: any) => {
				this.dataService.loggedUser(true);
				this.dataService.imageUrlContent(result.body.user.avatarUrl);
				localStorage.setItem('email', result.body.user.email);
				localStorage.setItem('login', result.body.user.login);
				localStorage.setItem('userId', result.body.user.userId);
				notify(`Hola ${result.body.user.login}-${result.body.user.email}`);
			});
	}

}
