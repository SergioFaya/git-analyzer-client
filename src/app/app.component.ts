import { Component, OnInit } from '@angular/core';
import { IUserData } from 'git-analyzer-types';
import * as socketIo from 'socket.io-client';
import { environment } from '../environments/environment';
import { Keys } from './models/Keys';
import { AuthService } from './services/AuthService/auth.service';
import { DisplayDashboardService } from './services/DisplayEvents/display-data.service';
import { getTokensFromStorage, notify } from './util/util';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit {
	// @ts-ignore
	private socket: SocketIOClient.Socket;

	public showLateral: boolean | undefined;
	public showFull: boolean | undefined;

	private logged: boolean | undefined;
	public imageUrl: string | undefined;

	readonly AUTH_SERVICE_URL = environment.authUrl;
	readonly SERVER_SERVICE_URL = environment.serverUrl;

	private _loginUrl!: string;
	public get loginUrl(): string {
		return this._loginUrl;
	}
	public set loginUrl(v: string) {
		this._loginUrl = v;
	}

	constructor(private dataService: DisplayDashboardService, private authService: AuthService) { }

	ngOnInit(): void {
		const size = window.innerWidth;
		this.adaptToSize(size);

		this.getLoginUrl();
		this.logged = localStorage.getItem(Keys.LOGGED) == Keys.LOGGED;
		this.dataService.logged.subscribe((logged) => {
			this.logged = localStorage.getItem(Keys.LOGGED) == Keys.LOGGED;
		});
		if (this.logged) {
			this.checkLogin();
		}
	}

	get logoutFunc() {
		return this.logOut.bind(this);
	}

	/**
	 * Prepares the socket for receiving info based on the state event
	 * @param state
	 */
	public initSocket(state: string): void {
		// TODO: add in config
		this.socket = socketIo(environment.authUrl);
		this.socket.on(state, (message: any) => {
			this.login(message.token, message.githubToken, (success: boolean) => {
				if (success) {
					this.dataService.showDashboard(DisplayDashboardService.landing);
					window.location.reload();
				} else {
					notify('Cannot show landing page, please refresh or try to log in again');
				}
			});
		});

	}

	private checkLogin() {
		this.authService
			.checkLogin()
			.then((result: any) => {
				if (result.expired === false) {
					this.dataService.showDashboard(DisplayDashboardService.landing);
				}
			}).catch((err) => {
				console.log(err);
				const { accessToken } = getTokensFromStorage();
				if (accessToken) {
					this.logOut();
				}
			});
	}

	private getLoginUrl() {
		this.authService.getLoginUrl()
			.then((response: any) => {
				this.loginUrl = response.data;
				var state = this.loginUrl.split('state=')[1];
				this.initSocket(state);
				this.send(state, 'message');
			}).catch(err => new Error(err));
	}

	private login(token: string, githubToken: string, callback: Function) {
		this.storeTokens(token, githubToken)
		localStorage.setItem(Keys.LOGGED, Keys.LOGGED);
		this.dataService.loggedUser(true);
		this.authService.getUserInfo()
			.then((userData: IUserData) => {
				localStorage.setItem(Keys.USER_DATA, JSON.stringify(userData));
				this.dataService.imageUrlContent(userData.imageUrl!);
				callback(true);
			})
			.catch((err: Error) => {
				console.log(err);
				callback(false);
			});
	}

	public logOut() {
		this.authService.logOut()
			.then(() => {
				this.dataService.loggedUser(false);
				localStorage.setItem(Keys.LOGGED, '');
				localStorage.setItem(Keys.USER_DATA, '{}');
				this.storeTokens('', '');
			}).then(() => {
				// recargamos la página para eliminar la info del usuario
				window.location.reload();
			}).catch(err =>
				notify('No se puede hacer logout ' + err.error.message)
			);
	}

	private storeTokens(accessToken: string, githubToken: string) {
		localStorage.setItem(Keys.GITHUB_TOKEN, githubToken);
		localStorage.setItem(Keys.ACCESS_TOKEN, accessToken);
	}

	public send(event: string, message: string): void {
		this.socket.emit(event, { socket: this.socket, message: message });
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

	onResize(event: any): void {
		const size = event.target.innerWidth;
		this.adaptToSize(size);
	}
}

