import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { dashboardRoutes } from './dashboard/dashboard.routes';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // { path: '', component: DashboardComponent},  antes de rutas hijas

  {
    // canActivate: [AuthGuard],  canActivate bloquea la ruta pero carga el modulo
    canLoad: [AuthGuard],  //AuthGuard debe implementarb el canload
    path: '',
    loadChildren: () => import ('./ingreso-egreso/ingreso-egreso.module').then( m => m.IngresoEgresoModule)
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  //forRoot: rutas principales
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
