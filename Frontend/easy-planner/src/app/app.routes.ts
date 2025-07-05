// src/app/routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.page').then((m) => m.RegisterPage),
  },

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage),
    canActivate: [AuthGuard],
  },

  {
    path: 'planning',
    loadComponent: () =>
      import('./pages/planning/planning.page').then((m) => m.PlanningPage),
    canActivate: [AuthGuard],
  },

  {
    path: 'problems',
    loadComponent: () =>
      import('./pages/problems/problems.page').then((m) => m.ProblemsPage),
    canActivate: [AuthGuard],
  },

  {
    path: 'sites',
    loadComponent: () =>
      import('./pages/sites/sites.page').then((m) => m.SitesPage),
    canActivate: [AuthGuard],
  },

  {
    path: 'history',
    loadComponent: () =>
      import('./pages/history/history.page').then((m) => m.HistoryPage),
    canActivate: [AuthGuard],
  },

  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/admin.page').then((m) => m.AdminPage),
    canActivate: [AuthGuard, AdminGuard],
  },

  {
    path: 'not-authorized',
    loadComponent: () =>
      import('./pages/not-authorized/not-authorized.page').then(
        (m) => m.NotAuthorizedPage,
      ),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
