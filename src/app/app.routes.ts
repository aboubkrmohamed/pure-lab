import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { MODULES } from './shared/core/constants';

const IMPLEMENTED = ['dashboard', 'users', 'reception'];

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      { path: 'home', loadComponent: () => import('./features/home/home').then(m => m.Home) },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
      },
      { path: 'users', loadComponent: () => import('./features/users/users').then(m => m.Users) },
      {
        path: 'reception',
        loadChildren: () =>
          import('./features/reception/reception.routes').then(m => m.RECEPTION_ROUTES),
      },
      ...MODULES.filter(m => !IMPLEMENTED.includes(m.route)).map(m => ({
        path: m.route,
        data: { title: m.title },
        loadComponent: () =>
          import('./features/placeholder/placeholder').then(p => p.Placeholder),
      })),
    ],
  },
  { path: '**', redirectTo: 'home' },
];
