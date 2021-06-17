import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = this.authService.currentUserValue
    const isLoggedIn = currentUser && currentUser.token
    const isApiUrl = request.url.startsWith(environment.apiUrl)

    if (isLoggedIn
      && isApiUrl
      && currentUser
      && request.url != `${environment.apiUrl}/${environment.jwtLogin}`
      && request.url != `${environment.apiUrl}/${environment.jwtRefresh}`
    ) {
      request = request.clone({
        setHeaders: {
          Authorization: `JWT ${currentUser.token}`
        }
      })
    }

    return next.handle(request).pipe(catchError(error => {

      if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)
        && request.url === `${environment.apiUrl}/${environment.jwtRefresh}`) {
        this.authService.logout()
        return throwError(error)
      }
      else if (error instanceof HttpErrorResponse && error.status === 403) {
        return this.handle403Error(request, next)
      } else {
        return throwError(error)
      }
    }))
  }
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private handle403Error(request: HttpRequest<any>, next: HttpHandler) {
    // console.log('handling 403')
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.jwt);
          return next.handle(this.addToken(request, token.jwt));
        }));

    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(this.addToken(request, jwt));
        }));
    }
  }
  private addToken(request: HttpRequest<any>, token: string) {
    const currentUser = this.authService.currentUserValue;
    return request.clone({
      setHeaders: {
        'Authorization': `JWT  ${currentUser.token}`
      }
    });
  }
}
