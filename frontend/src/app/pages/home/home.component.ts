import { Component, OnInit } from '@angular/core';
import { Category } from '../../models/Category';
import { Product } from '../../models/Product';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidebarComponent, CommonModule, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  products: Product[] = [];
  selectedCategoryId: number | null = null; // propiedad para la categoría seleccionada

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.categoryService.categories$.subscribe((cats) => {
      this.categories = cats;
      // Si existen categorías, selecciona la primera por defecto
      if (cats.length > 0) {
        this.onCategorySelected(cats[0]);
      }
    });
    this.categoryService.loadCategories();
  }

  onCategorySelected(category: Category): void {
    this.selectedCategoryId = category.id;
    this.productService.getProductsByCategory(category.id).subscribe({
      next: (prods) => {
        this.products = prods;
      },
      error: (err) => console.error(err),
    });
  }
}
