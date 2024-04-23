

import { Injectable } from '@angular/core';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { Router } from '@angular/router';
import { ConfigService } from '../services/config.service';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router, private confirser: ConfigService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.confirser.getToken();
        console.log(token);
        if (token) {
            const decodedHeader = this.confirser.decodeToken(token);
            let headertoken: number = decodedHeader.exp;
            let currentdate = new Date();
            let expDate: Date = new Date(headertoken * 1000);
            if (currentdate > expDate) {
                this.confirser.logout();
            }
            let headers = request.headers.set('Authorization', `Bearer ${token}`)
                .set('mode', 'no-cors');
            request = request.clone({ headers: headers });
        }
        return next.handle(request).pipe(
            tap((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {

                    if (event.status === 200) {
                        this.router.navigate(['/chat']);
                    }
                }
            }, (error: any) => {
                if (error instanceof HttpErrorResponse) {

                    if (error.status === 401 || error.status === 403) {

                        this.router.navigate(['/login']);
                    }
                }
            })
        );
    }
}
