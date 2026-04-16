import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { redirectGuard } from './guards/redirect-guard';
import { EmptyComponent } from './features/empty-component/empty-component';


export const routes: Routes = [
  //  redirect instead of hardcoded login
  { path: '', canActivate: [redirectGuard], component: EmptyComponent },

  // Public routes (no guard)
  { path: 'auth/login',           loadComponent: () => import('./features/auth/login/login').then(m => m.Login) },
  { path: 'auth/register',        loadComponent: () => import('./features/auth/register/register').then(m => m.Register) },
  { path: 'auth/forgot-password', loadComponent: () => import('./features/forgot-password/forgot-password').then(m => m.ForgotPasswordComponent) },

  //  authGuard on the SHELL — protects ALL children at once
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell/shell').then(m => m.Shell),
    children: [
      { path: 'dashboard',       loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard) },
      { path: 'hr',              loadComponent: () => import('./features/hr/hr').then(m => m.Hr) },
      { path: 'it',              loadComponent: () => import('./features/it/it').then(m => m.It) },
      { path: 'finance',         loadComponent: () => import('./features/finance/finance').then(m => m.Finance) },
      { path: 'procurement',     loadComponent: () => import('./features/procurement/procurement').then(m => m.Procurement) },
      { path: 'profile',         loadComponent: () => import('./shared/components/profile/profile').then(m => m.Profile) },
      { path: 'policies',        loadComponent: () => import('./features/policies/policies').then(m => m.Policies) },
      { path: 'service-disk',    loadComponent: () => import('./features/service-disk/service-disk').then(m => m.ServiceDisk) },
      { path: 'important-links', loadComponent: () => import('./features/important-links/important-links').then(m => m.ImportantLinks) },
    ]
  },

  { path: '**', redirectTo: 'auth/login' }
];