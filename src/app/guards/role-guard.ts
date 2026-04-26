import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const roleGuard = (requiredRole: string): CanActivateFn => {
  return () => {
    const role = sessionStorage.getItem('role');
    if (role === requiredRole) return true;
    inject(Router).navigate(['/dashboard']);
    return false;
  };
};
