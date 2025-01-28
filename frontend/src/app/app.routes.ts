import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Página principal
  { path: 'login', component: LoginComponent }, // Página de login
  { path: 'register', component: RegisterComponent }, // Página de registro
  { path: 'confirm-account', component: HomeComponent }, // Si confirm-account necesita lógica, vincúlala al HomeComponent u otro
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: '**', redirectTo: '/' }, // Ruta por defecto para manejar URLs no válidas
];
