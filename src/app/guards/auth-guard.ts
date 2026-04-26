import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { isTokenExpired } from '../core/token-utils';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return false;
  }

  const token = sessionStorage.getItem('token');

  if (token && !isTokenExpired(token)) {
    return true;
  }

  sessionStorage.removeItem('token');
  router.navigate(['/auth/login']);
  return false;
};