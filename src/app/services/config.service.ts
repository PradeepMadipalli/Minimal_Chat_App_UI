import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  profile: any;
  private configUrl = 'assets/config.json';
  constructor(private http: HttpClient, private router: Router) { }

  decodeToken(token: string): any {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      throw new Error('Invalid token format');
    }
    const decodedPayload = atob(tokenParts[1]);
    return JSON.parse(decodedPayload);
  }
  getConfig(): Observable<any> {
    return this.http.get(this.configUrl);
  }

  getToken(): string {
    if (typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem('Token');
    }
    return null;
  }
  getCuurectuserid(): string {
    if (typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem('userid');

    }
    return null;
  }
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    sessionStorage.removeItem('Profile');
    sessionStorage.removeItem('Token');
    sessionStorage.removeItem('userid');
    this.router.navigate(['/login']);
  }
}
