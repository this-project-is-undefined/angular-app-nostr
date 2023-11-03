import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';

const routes: Routes = [
  {
    title: $localize`UNDEFINED` as string,
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    title: $localize`UNDEFINED | login` as string,
    path: 'login',
    pathMatch: 'full',
    loadComponent: () => import('./pages/login/login.component'),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
