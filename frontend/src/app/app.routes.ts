import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { authGuard } from './guards/auth-guard/auth-guard.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Página principal
  { path: 'login', component: LoginComponent }, // Página de login
  { path: 'register', component: RegisterComponent }, // Página de registro
  { path: 'confirm-account', component: HomeComponent }, // Lógica de confirmación
  { path: 'reset-password', component: ResetPasswordComponent }, // Restablecer contraseña
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard], // Protección para asegurarse de que solo admins accedan
  },
  { path: 'product/:id', component: ProductDetailComponent }, // Detalle del producto
  { path: 'cart', component: CartComponent }, // Ruta del carrito

  { path: '**', redirectTo: '/' }, // Ruta por defecto para manejar URLs no válidas
];
