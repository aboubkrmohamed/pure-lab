import { Routes } from '@angular/router';
import { RECEPTION_TABS } from './reception.config';

export const RECEPTION_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./reception').then(m => m.Reception) },
  {
    path: 'registration',
    loadComponent: () => import('./registration/registration').then(m => m.Registration),
  },
  ...RECEPTION_TABS.filter(t => t.route !== 'registration').map(t => ({
    path: t.route,
    data: { title: t.label },
    loadComponent: () => import('../placeholder/placeholder').then(m => m.Placeholder),
  })),
];
