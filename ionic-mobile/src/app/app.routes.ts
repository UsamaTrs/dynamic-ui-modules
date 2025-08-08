import { TabDetailComponent } from './home/tabs/tab-detail/tab-detail.component';
// app.routes.ts
import { Routes } from '@angular/router';
import { TabsComponent } from './home/tabs/tabs.component';

export const routes: Routes = [
  { path: '', redirectTo: 'tabs/home', pathMatch: 'full' },
  {
    path: 'tabs',
    component: TabsComponent,
    children: [
      { path: 'home', loadComponent: () => import('./home/home.page').then(m => m.HomePage) },
      { path: 'tab/:id', loadComponent: () => import('./home/tabs/tab-detail/tab-detail.component').then(m => m.TabDetailComponent) },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ]
  }
];
