import { Component, Input, input, OnInit } from '@angular/core';
import { Category } from '../../models/Category';
import { Product } from '../../models/Product';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductListComponent } from '../../components/product-list/product-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SidebarComponent,
    CommonModule,
    ProductCardComponent,
    ProductListComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  products: Product[] = [];
  selectedCategoryId: number | null = null;
  isMenuOpen: boolean = false; // Estado del menú desplegable

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.categoryService.loadCategories();
    this.categoryService.categories$.subscribe((cats) => {
      this.categories = cats;
      if (cats.length > 0) {
        this.onCategorySelected(cats[0]);
      }
    });
  }

  onCategorySelected(category: Category): void {
    this.selectedCategoryId = category.id;
    this.productService.getProductsByCategory(category.id).subscribe({
      next: (prods) => {
        this.products = prods;
      },
      error: (err) => console.error(err),
    });
    this.closeMenu(); // Cierra el menú al seleccionar una categoría
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  selectCategory(category: Category): void {
    this.onCategorySelected(category);
  }
}
