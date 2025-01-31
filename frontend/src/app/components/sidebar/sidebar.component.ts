import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/Category';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  @Input() categories: Category[] = []; // Recibimos las categorías como input
  @Output() categorySelected: EventEmitter<Category> =
    new EventEmitter<Category>(); // Emisión del evento de selección de categoría
  isLoggedIn = false;
  isAdmin = false;

  constructor(
    private categoryService: CategoryService,
    private authService: AuthService // Inyectamos AuthService
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn; // Actualiza el estado de si el usuario está autenticado
    });

    this.authService.isAdmin$.subscribe((admin) => {
      this.isAdmin = admin; // Actualiza el estado del rol de administrador
    });

    // Suscripción al observable de categorías
    this.categoryService.categories$.subscribe((categories) => {
      this.categories = categories; // Actualiza las categorías en el Sidebar
    });

    // Cargar las categorías al inicio
    this.categoryService.loadCategories();
  }

  // Emitir el evento cuando se selecciona una categoría
  selectCategory(category: Category) {
    this.categorySelected.emit(category); // Emite el evento de selección de categoría
  }
}
