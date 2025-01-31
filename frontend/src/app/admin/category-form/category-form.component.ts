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
import { Subscription } from 'rxjs';
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
      console.error('⚠️ No tienes permisos para añadir categorías.');
      return;
    }

    if (this.categoryForm.invalid) return;

    this.categoryService.addCategory(this.categoryForm.value).subscribe({
      next: () => {
        this.categoryService.loadCategories();
        this.categoryForm.reset();
      },
      error: (err) => console.error(err),
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
    if (this.editCategoryForm.invalid || !this.selectedCategoryId) return;

    this.categoryService
      .updateCategory(this.selectedCategoryId, {
        name: this.editCategoryForm.value.name,
      })
      .subscribe({
        next: () => {
          this.categoryService.loadCategories();
          this.cancelEdit();
        },
        error: (err) => console.error(err),
      });
  }

  deleteCategory() {
    if (!this.selectedCategoryId) return;

    this.categoryService.deleteCategory(this.selectedCategoryId).subscribe({
      next: () => {
        this.categoryService.loadCategories();
        this.cancelEdit();
      },
      error: (err) => console.error(err),
    });
  }

  cancelEdit() {
    this.editCategoryForm.reset();
    this.selectedCategoryId = null;
  }
}
