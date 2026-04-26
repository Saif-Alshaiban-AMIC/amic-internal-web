import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, EMPTY, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth-service';
import { isTokenExpired } from '../core/token-utils';

const AUTH_URLS = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/refresh', '/auth/logout'];

let isRefreshing = false;
const refreshDone$ = new BehaviorSubject<string | null>(null);

function addBearer(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  if (AUTH_URLS.some(url => req.url.includes(url))) {
    return next(req);
  }

  const router = inject(Router);
  const authService = inject(AuthService);

  const token = sessionStorage.getItem('token');

  if (!token || isTokenExpired(token)) {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('role');
    router.navigate(['/auth/login']);
    return EMPTY;
  }

  return next(addBearer(req, token)).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      const refreshToken = sessionStorage.getItem('refreshToken');
      if (!refreshToken) {
        router.navigate(['/auth/login']);
        return EMPTY;
      }

      if (isRefreshing) {
        return refreshDone$.pipe(
          filter((t): t is string => t !== null),
          take(1),
          switchMap(newToken => next(addBearer(req, newToken)))
        );
      }

      isRefreshing = true;
      refreshDone$.next(null);

      return authService.refresh(refreshToken).pipe(
        switchMap(response => {
          isRefreshing = false;
          authService.storeTokens(response);
          refreshDone$.next(response.accessToken);
          return next(addBearer(req, response.accessToken));
        }),
        catchError(refreshError => {
          isRefreshing = false;
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('refreshToken');
          sessionStorage.removeItem('role');
          router.navigate(['/auth/login']);
          return EMPTY;
        })
      );
    })
  );
};
