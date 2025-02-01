// sidebar.component.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Category } from '../../models/Category';
import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  @Input() categories: Category[] = [];
  @Input() selectedCategoryId: number | null = null; // recibe el id de la categoría seleccionada
  @Output() categorySelected: EventEmitter<Category> =
    new EventEmitter<Category>();

  isLoggedIn = false;
  isAdmin = false;

  constructor(
    private categoryService: CategoryService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
    this.authService.isAdmin$.subscribe((admin) => {
      this.isAdmin = admin;
    });
    this.categoryService.categories$.subscribe((categories) => {
      this.categories = categories;
    });
    this.categoryService.loadCategories();
  }

  selectCategory(category: Category) {
    // Emite el evento para que Home actualice la selección
    this.categorySelected.emit(category);
  }
}
