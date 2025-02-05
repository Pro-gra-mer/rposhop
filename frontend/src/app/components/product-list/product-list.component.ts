import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/Product';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  hasSearched: boolean = false;
  resultMessage: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.searchResults$.subscribe((results) => {
      this.products = results;
      this.hasSearched = true;
      this.resultMessage =
        results.length > 0
          ? 'Resultados de la búsqueda'
          : 'No se encontraron productos.';
    });

    this.productService.products$.subscribe((products) => {
      this.products = products;
      this.hasSearched = false;
      this.resultMessage = ''; // Limpiar mensaje cuando se cargan productos normales
    });
  }
}
