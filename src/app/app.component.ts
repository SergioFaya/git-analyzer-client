import { Component, OnInit } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { environment } from '../environments/environment';
import { AuthService } from './services/AuthService/auth.service';
import { DataService } from './services/DisplayEvents/display-data.service';
import { notify } from './util/util';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit {
	// @ts-ignore
	socket: SocketIOClient.Socket;
	showLateral: boolean | undefined;
	showFull: boolean | undefined;

	logged: boolean | undefined;
	imageUrl: string | undefined;


	// TODO: sacar url y paths a config
	readonly AUTH_SERVICE_URL = environment.authUrl;
	readonly SERVER_SERVICE_URL = environment.serverUrl;


	private _loginUrl!: string;
	public get loginUrl(): string {
		return this._loginUrl;
	}
	public set loginUrl(v: string) {
		this._loginUrl = v;
	}


	constructor(private dataService: DataService, private authService: AuthService) { }

	ngOnInit(): void {
		const size = window.innerWidth;
		this.adaptToSize(size);
		
		this.getLoginUrl();
		this.logged = localStorage.getItem('logged') == 'logged';
		this.dataService.logged.subscribe((logged) => {
			this.logged = localStorage.getItem('logged') == 'logged';
		});
	}

	get logoutFunc() {
		return this.logOut.bind(this);
	}

	/**
	 * Prepares the socket for receiving info based on the state event
	 * @param state
	 */
	public initSocket(state: string): void {
		this.socket = socketIo('http://localhost:3000');
		this.socket.on(state, (message: any) => {
			this.login(message.token, message.githubToken);
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
	private login(token: string, githubToken: string) {
		this.storeTokens(token, githubToken)
		localStorage.setItem('logged', 'logged');
		this.dataService.loggedUser(true);
		this.authService.getUserInfo()
			.then((result: any) => {
				// TODO: guardar todos los datos del usuario para las peticiones de la api
				localStorage.setItem('avatarUrl', result.userData.imageUrl);
				this.dataService.imageUrlContent(result.userData.imageUrl);
			})
			.catch((err: any) => console.log(err));
	}

	public logOut() {
		this.authService.logOut()
			.then(() => {
				notify('Taluego');
				this.dataService.loggedUser(false);
				localStorage.setItem('logged', '');
				localStorage.setItem('avatarUrl', '');
				this.storeTokens('', '');
			}).then(() => {
				// recargamos la página para eliminar la info del usuario
				window.location.reload();
			}).catch(err =>
				notify('No se puede hacer logout ' + err.error.message)
			);

	}

	private storeTokens(accessToken: string, githubToken: string) {
		localStorage.setItem('githubToken', githubToken);
		localStorage.setItem('accessToken', accessToken);
	}

	public send(event: string, message: string): void {
		this.socket.emit(event, { socket: this.socket, message: message });
	}

	onResize(event: any): void {
		const size = event.target.innerWidth;
		this.adaptToSize(size);
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

