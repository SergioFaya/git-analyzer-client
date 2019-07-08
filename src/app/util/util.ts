import { ElementRef } from '@angular/core';
import { IUserData } from 'git-analyzer-types';
// @ts-ignore
import * as UIkit from 'uikit';
import { Keys } from '../models/Keys';

/**
 * Creates an UIkit notification
 * @param data 
 * @param timeout 
 */
export function notify(data: string, timeout: number = 3000): void {
	UIkit.notification({
		message: data,
		status: 'primary',
		timeout: 5000
	});
}

/**
 * Adds a class to an elementRef
 * @param element 
 * @param className 
 */
export function addClassToElement(element: ElementRef, className: string): void {
	(element.nativeElement.classList as DOMTokenList).add(className);
}

/**
 * Removes a class to an elementRef
 * @param element 
 * @param className 
 */
export function removeClassFromElement(element: ElementRef, className: string): void {
	(element.nativeElement.classList as DOMTokenList).remove(className);
}

/**
 * Generates a rgb(100,100,100) like string color
 */
export function generateRandomColor(): string {
	const r = Math.floor(Math.random() * 200);
	const g = Math.floor(Math.random() * 200);
	const b = Math.floor(Math.random() * 200);
	return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}

/**
 * Returns the stored tokens in the browser
 */
export function getTokensFromStorage() {
	const accessToken = localStorage.getItem(Keys.ACCESS_TOKEN) as string;
	const githubToken = localStorage.getItem(Keys.GITHUB_TOKEN) as string;
	return { accessToken, githubToken };
}

/**
 * Returns the data of the user from the local storage
 */
export function getUserDataFromLocalStorage(): IUserData {
	const userDataJson: string = localStorage.getItem(Keys.USER_DATA) as string;
	const userData: IUserData = JSON.parse(userDataJson);
	return userData;
}

/**
 * Returns a string date from a timestamp
 * @param timestamp 
 */
export function getDateFromTimestamp(timestamp: number) {
	// Create a new JavaScript Date object based on the timestamp
	// multiplied by 1000 so that the argument is in milliseconds, not seconds.
	var date = new Date(timestamp);
	// Hours part from the timestamp
	var hours = date.getHours();
	// Minutes part from the timestamp
	var minutes = "0" + date.getMinutes();
	// Seconds part from the timestamp
	var seconds = "0" + date.getSeconds();
	// Will display time in 10:30:23 format
	var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + ' - ' + formatDate(date);
	return formattedTime;
}

/**
 * Formats a date to english calendar
 * @param date 
 */
export function formatDate(date: Date) {
	var monthNames = [
		"January", "February", "March",
		"April", "May", "June", "July",
		"August", "September", "October",
		"November", "December"
	];

	var day = date.getDate();
	var monthIndex = date.getMonth();
	var year = date.getFullYear();

	return day + ' ' + monthNames[monthIndex] + ' ' + year;
}