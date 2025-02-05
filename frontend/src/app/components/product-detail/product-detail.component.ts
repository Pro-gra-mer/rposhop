import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/Product';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { LocalCartService } from '../../services/local-cart.service';

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
  message: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private authService: AuthService,
    private localCartService: LocalCartService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
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
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (token) {
      // Usuario autenticado: utiliza el backend para el carrito persistente
      this.cartService.addToCart(product.id, 1).subscribe({
        next: (cart) => {
          console.log('Producto añadido al carrito persistente:', cart);
          this.message = 'Producto añadido al carrito';
          setTimeout(() => {
            this.message = '';
          }, 4000);
        },
        error: (err) => {
          console.error(
            'Error al añadir producto al carrito persistente:',
            err
          );
          this.error = 'No se pudo añadir el producto al carrito.';
        },
      });
    } else {
      // Usuario anónimo: guarda en localStorage con datos completos del producto
      this.localCartService.addItem(
        product.id,
        1,
        product.name,
        product.price,
        product.imageUrl
      );
      this.message =
        'Producto añadido al carrito. Por favor, inicia sesión para proceder al pago';
      setTimeout(() => {
        this.message = '';
      }, 4000);
    }
  }
}
