import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth-service';
import { TokenRefreshCoordinator } from '../services/token-refresh-coordinator';
import { isTokenExpired } from '../core/token-utils';

const AUTH_URLS = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/refresh', '/auth/logout'];

function addBearer(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

function clearSession(router: Router): void {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('refreshToken');
  sessionStorage.removeItem('role');
  router.navigate(['/auth/login']);
}

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  if (AUTH_URLS.some(url => req.url.includes(url))) {
    return next(req);
  }

  const router      = inject(Router);
  const authService = inject(AuthService);
  const coordinator = inject(TokenRefreshCoordinator);

  const token = sessionStorage.getItem('token');

  if (!token || isTokenExpired(token)) {
    clearSession(router);
    return EMPTY;
  }

  return next(addBearer(req, token)).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      const refreshToken = sessionStorage.getItem('refreshToken');
      if (!refreshToken) {
        clearSession(router);
        return EMPTY;
      }

      // Another request is already refreshing — queue behind it
      if (coordinator.isRefreshing) {
        return coordinator.refreshDone$.pipe(
          filter((t): t is string => t !== null),
          take(1),
          switchMap(newToken => next(addBearer(req, newToken)))
        );
      }

      coordinator.isRefreshing = true;
      coordinator.refreshDone$.next(null);

      return authService.refresh(refreshToken).pipe(
        switchMap(response => {
          coordinator.isRefreshing = false;
          authService.storeTokens(response);
          coordinator.refreshDone$.next(response.accessToken);
          return next(addBearer(req, response.accessToken));
        }),
        catchError(() => {
          coordinator.isRefreshing = false;
          clearSession(router);
          return EMPTY;
        })
      );
    })
  );
};
