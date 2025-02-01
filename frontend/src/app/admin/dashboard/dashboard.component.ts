import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductFormComponent } from '../product-form/product-form.component';
import { CategoryFormComponent } from '../category-form/category-form.component';
import { Category } from '../../models/Category';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, ProductFormComponent, CategoryFormComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  selectedCategory: Category | null = null;

  // Método que maneja el evento emitido desde el SidebarComponent
  onCategorySelected(category: Category) {
    this.selectedCategory = category;
    // Aquí podrías agregar lógica para mostrar productos de la categoría seleccionada
  }
}
