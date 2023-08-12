import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import jwtDecode from 'jwt-decode';

@Injectable()
export class AuthService {
    constructor(private http: HttpClient) {}

    async login(username: string, password: string) {
        const response = await lastValueFrom(
            this.http.post<any>('token', { username, password })
        );
        this.setSession(response.data);
    }

    private setSession(authResult: { access_token: string; }) {
      const decodedToken = jwtDecode<{ exp: number }>(authResult.access_token);

      const today = new Date();
      const expiresDelta = decodedToken.exp * 1000;
      const expiresAt = new Date(today.getTime() + expiresDelta);

      localStorage.setItem('id_token', authResult.access_token);
      localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
  }          

  logout() {
      localStorage.removeItem("id_token");
      localStorage.removeItem("expires_at");
  }

  public isLoggedIn() {
      return new Date().getTime() < this.getExpiration().getTime();
  }

  isLoggedOut() {
      return !this.isLoggedIn();
  }

  getExpiration() {
      const expiration = localStorage.getItem("expires_at");
      const expiresAt = JSON.parse(expiration);
      return new Date(expiresAt);
  }    
}
