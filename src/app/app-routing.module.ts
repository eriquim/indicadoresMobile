import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './pages/public/login/login.module#LoginPageModule' },
  { path: 'dashboard', loadChildren: './pages/logged/dashboard/dashboard.module#DashboardPageModule' },
  {
    path: 'logged',
    canActivate: [AuthGuard],
    loadChildren: './pages/logged/logged-routing.module#LoggedRoutingModule'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
