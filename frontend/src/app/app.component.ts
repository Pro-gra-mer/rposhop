import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthService } from './services/auth.service'; // Asegúrate de importar el AuthService

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], // Corregido "styleUrl" a "styleUrls"
})
export class AppComponent implements OnInit {
  title = 'RPOShop';

  constructor(private authService: AuthService) {} // Asegúrate de inyectar AuthService

  ngOnInit(): void {
    this.authService.restoreSession(); // Restaura la sesión al cargar el componente
  }
}
