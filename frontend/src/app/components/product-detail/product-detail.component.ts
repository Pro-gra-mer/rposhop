import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/Product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    // Obtener el id del producto de la URL
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      const id = Number(productId);
      this.productService.getProductById(id).subscribe({
        next: (prod: Product) => {
          this.product = prod;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.error = 'Error al cargar el producto.';
          this.loading = false;
        },
      });
    } else {
      this.error = 'Producto no encontrado.';
      this.loading = false;
    }
  }

  addToCart(product: Product): void {
    // Implementa la lógica para añadir el producto al carrito.
    console.log('Producto añadido al carrito:', product);
    // Ejemplo: this.cartService.addProduct(product);
  }
}
