import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { MODULES } from './shared/core/constants';
export const routes: Routes = [


   {
    path: '',
    component: MainLayout,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      {
        path: 'home',
        loadComponent: () => import('./features/home/home').then(m => m.Home),
      },
        {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
      },
  ...MODULES.filter(m => m.route !== 'dashboard').map(m => ({
        path: m.route,
        data: { title: m.title },
        loadComponent: () =>
          import('./features/placeholder/placeholder').then(p => p.Placeholder),
      })),
    ],
  },
  { path: '**', redirectTo: 'home' },


];
