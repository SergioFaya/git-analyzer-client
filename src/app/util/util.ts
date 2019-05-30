import { ElementRef } from '@angular/core';
// @ts-ignore
import * as UIkit from 'uikit';

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
