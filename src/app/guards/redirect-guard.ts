import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const redirectGuard: CanActivateFn = () => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    router.navigate(['/auth/login']);
    return false;
  }

  const token = localStorage.getItem('token');
  router.navigate([token ? '/dashboard' : '/auth/login']);
  return false;
};