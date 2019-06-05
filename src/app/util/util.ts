import { ElementRef } from '@angular/core';
import { IUserData } from 'git-analyzer-types';
// @ts-ignore
import * as UIkit from 'uikit';
import { Keys } from '../models/Keys';

export function notify(data: string, timeout: number = 3000): void {
	UIkit.notification({
		message: data,
		status: 'primary',
		timeout: 5000
	});
}

export function addClassToElement(element: ElementRef, className: string): void {
	(element.nativeElement.classList as DOMTokenList).add(className);
}

export function removeClassFromElement(element: ElementRef, className: string): void {
	(element.nativeElement.classList as DOMTokenList).remove(className);
}

export function generateRandomColor(): string {
	const r = Math.floor(Math.random() * 200);
	const g = Math.floor(Math.random() * 200);
	const b = Math.floor(Math.random() * 200);
	return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}

export function getTokensFromStorage() {
	const accessToken = localStorage.getItem(Keys.ACCESS_TOKEN) as string;
	const githubToken = localStorage.getItem(Keys.GITHUB_TOKEN) as string;
	return { accessToken, githubToken };
}

export function getUserDataFromLocalStorage(): IUserData {
	const userDataJson: string = localStorage.getItem(Keys.USER_DATA) as string;
	const userData: IUserData = JSON.parse(userDataJson);
	return userData;
}