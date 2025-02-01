import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/Category';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css',
})
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup;
  editCategoryForm: FormGroup;
  categories: Category[] = [];
  selectedCategoryId: number | null = null;
  isAdmin = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private authService: AuthService // Inyecta el AuthService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.editCategoryForm = this.fb.group({
      selectedCategoryId: [null, Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit() {
    this.categoryService.categories$.subscribe((categories) => {
      this.categories = categories;
    });
    this.categoryService.loadCategories();

    // Suscríbete al estado de isAdmin$ para actualizar isAdmin
    this.authService.isAdmin$.subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    });
  }

  addCategory() {
    if (!this.isAdmin) {
      this.errorMessage = '⚠️ No tienes permisos para añadir categorías.';
      this.clearMessages();
      return;
    }

    if (this.categoryForm.invalid) return;

    this.categoryService.addCategory(this.categoryForm.value).subscribe({
      next: () => {
        this.successMessage = 'Categoría añadida correctamente.';
        this.clearMessages();
        this.errorMessage = null;
        this.categoryService.loadCategories();
        this.categoryForm.reset();
      },
      error: (err) => {
        this.errorMessage = 'Error al añadir la categoría.';
        this.clearMessages();
        this.successMessage = null;
        console.error(err);
      },
    });
  }

  onCategorySelect(event: Event) {
    const selectedId = Number((event.target as HTMLSelectElement).value);
    const category = this.categories.find((c) => c.id === selectedId);
    if (category) {
      this.selectedCategoryId = category.id;
      this.editCategoryForm.patchValue({ name: category.name });
    }
  }

  updateCategory() {
    if (!this.isAdmin) {
      this.errorMessage = '⚠️ No tienes permisos para editar categorías.';
      this.clearMessages();
      return;
    }

    if (this.editCategoryForm.invalid || !this.selectedCategoryId) return;

    this.categoryService
      .updateCategory(this.selectedCategoryId, {
        name: this.editCategoryForm.value.name,
      })
      .subscribe({
        next: () => {
          this.successMessage = 'Categoría actualizada correctamente.';
          this.clearMessages();
          this.errorMessage = null;
          this.categoryService.loadCategories();
          this.cancelEdit();
        },
        error: (err) => {
          this.errorMessage = 'Error al actualizar la categoría.';
          this.clearMessages();
          this.successMessage = null;
          console.error(err);
        },
      });
  }

  deleteCategory() {
    if (!this.isAdmin) {
      this.errorMessage = '⚠️ No tienes permisos para eliminar categorías.';
      this.clearMessages();
      return;
    }

    if (!this.selectedCategoryId) return;

    this.categoryService.deleteCategory(this.selectedCategoryId).subscribe({
      next: () => {
        this.successMessage = 'Categoría eliminada correctamente.';
        this.clearMessages();
        this.errorMessage = null;
        this.categoryService.loadCategories();
        this.cancelEdit();
      },
      error: (err) => {
        this.errorMessage = 'Error al eliminar la categoría.';
        this.clearMessages();
        this.successMessage = null;
        console.error(err);
      },
    });
  }

  cancelEdit() {
    this.editCategoryForm.reset();
    this.selectedCategoryId = null;
  }

  private clearMessages() {
    setTimeout(() => {
      this.successMessage = null;
      this.errorMessage = null;
    }, 3000); // Limpia los mensajes después de 5 segundos
  }
}
