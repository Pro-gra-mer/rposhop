import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { Category } from '../../models/Category';
import { Product } from '../../models/Product';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent implements OnInit {
  addProductForm: FormGroup;
  editProductForm: FormGroup;
  categories: Category[] = [];
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedProductId: number | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isAdmin = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private authService: AuthService
  ) {
    // Formulario para añadir producto con el campo description
    this.addProductForm = this.fb.group({
      categoryId: [null, Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      imageUrl: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      description: [''], // nuevo campo para la descripción
    });

    // Formulario para editar producto, también se añade description
    this.editProductForm = this.fb.group({
      categorySelect: [null, Validators.required],
      productSelect: [null, Validators.required],
      editName: ['', [Validators.required, Validators.minLength(3)]],
      editImageUrl: ['', Validators.required],
      editPrice: [null, [Validators.required, Validators.min(0)]],
      editDescription: [''], // nuevo campo para la descripción en edición
    });
  }

  ngOnInit(): void {
    // Suscríbete a isAdmin$
    this.authService.isAdmin$.subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    });

    this.categoryService.categories$.subscribe(
      (cats) => (this.categories = cats)
    );
    this.categoryService.loadCategories();

    this.productService.products$.subscribe((prods) => {
      this.products = prods;
      this.filteredProducts = prods;
    });
    this.productService.loadProducts();
  }

  addProduct(): void {
    if (!this.isAdmin) {
      this.errorMessage = '⚠️ No tienes permisos para añadir productos.';
      this.clearMessages();
      return;
    }
    if (this.addProductForm.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      this.clearMessages();
      return;
    }
    this.productService.addProduct(this.addProductForm.value).subscribe({
      next: () => {
        this.successMessage = 'Producto añadido correctamente.';
        this.addProductForm.reset();
        this.productService.loadProducts();
        this.clearMessages();
      },
      error: (err) => {
        this.errorMessage = 'Error al añadir el producto.';
        this.clearMessages();
        console.error(err);
      },
    });
  }

  onCategorySelect(): void {
    const categoryId = Number(this.editProductForm.value.categorySelect);
    this.filteredProducts = categoryId
      ? this.products.filter((p) => p.categoryId === categoryId)
      : this.products;
    this.editProductForm.patchValue({ productSelect: null });
  }

  onProductSelect(event: Event): void {
    const prodId = Number((event.target as HTMLSelectElement).value);
    const product = this.products.find((p) => p.id === prodId);
    if (product) {
      this.selectedProductId = product.id;
      this.editProductForm.patchValue({
        categorySelect: product.categoryId, // asignar la categoría actual
        editName: product.name,
        editImageUrl: product.imageUrl,
        editPrice: product.price,
        editDescription: product.description || '',
      });
    }
  }

  updateProduct(): void {
    if (!this.isAdmin) {
      this.errorMessage = '⚠️ No tienes permisos para editar productos.';
      this.clearMessages();
      return;
    }
    if (this.editProductForm.invalid || !this.selectedProductId) return;
    const updated = {
      name: this.editProductForm.value.editName,
      imageUrl: this.editProductForm.value.editImageUrl,
      price: this.editProductForm.value.editPrice,
      categoryId: this.editProductForm.value.categorySelect,
      description: this.editProductForm.value.editDescription, // envía la descripción actualizada
    };
    this.productService
      .updateProduct(this.selectedProductId, updated)
      .subscribe({
        next: () => {
          this.successMessage = 'Producto actualizado correctamente.';
          this.productService.loadProducts();
          this.cancelEdit();
          this.clearMessages();
        },
        error: (err) => {
          this.errorMessage = 'Error al actualizar el producto.';
          this.clearMessages();
          console.error(err);
        },
      });
  }

  deleteProduct(): void {
    if (!this.isAdmin) {
      this.errorMessage = '⚠️ No tienes permisos para eliminar productos.';
      this.clearMessages();
      return;
    }
    if (!this.selectedProductId) return;
    this.productService.deleteProduct(this.selectedProductId).subscribe({
      next: () => {
        this.successMessage = 'Producto eliminado correctamente.';
        this.productService.loadProducts();
        this.cancelEdit();
        this.clearMessages();
      },
      error: (err) => {
        this.errorMessage = 'Error al eliminar el producto.';
        this.clearMessages();
        console.error(err);
      },
    });
  }

  cancelEdit(): void {
    this.editProductForm.reset();
    this.selectedProductId = null;
  }

  private clearMessages(): void {
    setTimeout(() => {
      this.successMessage = null;
      this.errorMessage = null;
    }, 3000);
  }
}
