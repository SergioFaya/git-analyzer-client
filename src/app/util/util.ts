import * as UIkit from 'uikit';

export function notify(data: string, timeout: number = 3000): void {
    UIkit.notification({
        message: data,
        status: 'primary',
        timeout: 5000
    });
}

