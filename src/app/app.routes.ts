import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'tasks',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/tasks/components/task-list/task-list.component').then(m => m.TaskListComponent),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];