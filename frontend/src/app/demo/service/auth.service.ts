import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom, Subscription, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import jwtDecode from 'jwt-decode';

@Injectable()
export class AuthService {
    tokenSubscription = new Subscription();

    constructor(private http: HttpClient, private router: Router) {}

    async login(username: string, password: string) {
        const response = await lastValueFrom(
            this.http.post<any>('token', { username, password })
        );
        this.setSession(response);
    }

    async register(username: string, password: string) {
        const response = await lastValueFrom(
            this.http.post<any>('register', { username, password })
        );
        this.setSession(response);
    }

    private setSession(authResult: { access_token: string }) {
        const decodedToken = jwtDecode<{ exp: number }>(
            authResult.access_token
        );

        const expiresDelta = decodedToken.exp * 1000;
        const expiresAt = new Date(expiresDelta);

        localStorage.setItem('id_token', authResult.access_token);
        localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));

        this.expirationCounter(expiresAt);
    }

    expirationCounter(expiresAt: Date) {
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
