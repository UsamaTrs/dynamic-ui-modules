import { TabDetailComponent } from './home/tabs/tab-detail/tab-detail.component';
// app.routes.ts
import { Routes } from '@angular/router';
import { TabsComponent } from './home/tabs/tabs.component';
import { HomePage } from './home/home.page';

export const routes: Routes = [
  { path: '', redirectTo: 'tabs', pathMatch: 'full' },
  {
    path: 'tabs',
    loadComponent: () => import('./home/tabs/tabs.component').then(m => m.TabsComponent),
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./home/home.page').then(m => m.HomePage)
      },
      {
        path: 'tab/:id',
        loadComponent: () =>
          import('./home/tabs/tab-detail/tab-detail.component').then(m => m.TabDetailComponent),
          runGuardsAndResolvers: 'always'
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ]
    },
  ];
