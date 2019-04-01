import { Component, AfterViewInit, OnInit, Input } from '@angular/core';
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

	ngOnInit(): void {
		this.size = window.innerWidth;
		this.adaptToSize(this.size);
		this.authService.getLoginUrl()
			.then((response: any) => {
				this.loginUrl = response.data;
				var state = this.loginUrl.split('state=')[1];
				this.initSocket(state);
				this.send(state, 'message')
			}).catch(err => new Error(err));
	}

	/**
	 * Prepares the socket for receiving info based on the state event
	 * @param state
	 */
	public initSocket(state: string): void {
		this.socket = socketIo('http://localhost:3000');
		this.socket.on(state, (message) => {
			this.login(message.token, message.githubToken);
		});
	}

	private login(token, githubToken) {
		this.storeTokens(token, githubToken)
		this.dataService.loggedUser(true);
		this.authService.getUserInfo()
		.then(
			x => console.log(x)
		)
		.catch(err => console.log(err));
	}

	get logoutFunc() {
		return this.logOut.bind(this);
	}

	public logOut() {
		this.authService.logOut()
			.then(() => {
				notify('Taluego');
				this.dataService.loggedUser(false);
				this.storeTokens(null, null);
			}).catch(err =>
				notify('No se puede hacer logout ' + err.error.message)
			);

	}

	private storeTokens(accessToken: string, githubToken: string) {
		localStorage.setItem('githubToken', githubToken);
		localStorage.setItem('accessToken', accessToken);
	}

	private obtainBasicInfo() {
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

	public send(event: string, message: string): void {
		this.socket.emit(event, { socket: this.socket, message: message });
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

}
