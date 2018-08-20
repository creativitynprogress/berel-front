import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LoginComponent } from './LoginComponent/login.component';
import { AuthGuard } from './_guards/auth.guard';
import { AdminGuard } from './_guards/admin.guard';

const ROUTES: Routes = [
  {path: 'login', component: LoginComponent},
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', loadChildren: './UserModule/user.module#UserModule', canActivate: [AuthGuard]},
  {path: 'admin', loadChildren: './AdminModule/admin.module#AdminModule', canActivate: [AdminGuard]}
];

export const routing = RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules });
