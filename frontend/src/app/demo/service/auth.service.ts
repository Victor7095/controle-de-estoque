import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom, Subscription, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import jwtDecode from 'jwt-decode';

@Injectable()
export class AuthService {
    tokenSubscription = new Subscription();

    constructor(private http: HttpClient, private router: Router) {
        const token = localStorage.getItem('id_token');
        if (!token) {
            router.navigate(['/auth/login']);
            return;
        }
        const expiresAt = localStorage.getItem('expires_at');
        if (!expiresAt) {
            router.navigate(['/auth/login']);
            return;
        }
        const expiresAtDate = new Date(JSON.parse(expiresAt));
        if (new Date() > expiresAtDate) {
            router.navigate(['/auth/login']);
            return;
        }
        this.setSession(token);
    }

    async login(username: string, password: string) {
        const response = await lastValueFrom(
            this.http.post<any>('token', { username, password })
        );
        this.setSession(response.access_token);
    }

    async register(username: string, password: string) {
        const response = await lastValueFrom(
            this.http.post<any>('register', { username, password })
        );
        this.setSession(response.access_token);
    }

    private setSession(access_token: string) {
        const decodedToken = jwtDecode<{ exp: number }>(
            access_token
        );

        const expiresDelta = decodedToken.exp * 1000;
        const expiresAt = new Date(expiresDelta);

        localStorage.setItem('id_token', access_token);
        localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));

        this.expirationCounter(expiresAt);
    }

    private expirationCounter(expiresAt: Date) {
        this.tokenSubscription.unsubscribe();
        this.tokenSubscription = of(null)
            .pipe(delay(expiresAt))
            .subscribe((expired) => {
                console.log('EXPIRED!!');
                this.logout();
                this.router.navigate(['/auth/login']);
            });
    }

    logout() {
        this.tokenSubscription.unsubscribe();
        localStorage.clear();
        this.router.navigate(["/auth/login"]);
    }
}
