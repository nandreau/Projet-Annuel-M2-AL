import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full',
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.page').then( m => m.AdminPage)
  },
  {
    path: 'planning',
    loadComponent: () => import('./pages/planning/planning.page').then( m => m.PlanningPage)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then( m => m.DashboardPage)
  },
  {
    path: 'problems',
    loadComponent: () => import('./pages/problems/problems.page').then( m => m.ProblemsPage)
  },
  {
    path: 'sites',
    loadComponent: () => import('./pages/sites/sites.page').then( m => m.SitesPage)
  },
];
