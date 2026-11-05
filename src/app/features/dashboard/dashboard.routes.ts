import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard').then(m => m.Dashboard),
  },
  {
    path: 'summary',
    loadComponent: () => import('./summary/summary').then(m => m.Summary),
  },
  {
    path: 'admin-tools',
    loadComponent: () => import('./admin-tools/admin-tools').then(m => m.AdminTools),
  },
  {
    path: 'workflow',
    loadComponent: () => import('./workflow/workflow').then(m => m.Workflow),
  },
];
