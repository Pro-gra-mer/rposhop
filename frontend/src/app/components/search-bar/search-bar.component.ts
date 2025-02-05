import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
})
export class SearchBarComponent {
  searchInput = '';

  constructor(private productService: ProductService) {}

  search(): void {
    if (this.searchInput.trim()) {
      this.productService
        .searchProducts(this.searchInput)
        .subscribe((results) => {
          console.log('Resultados de búsqueda:', results);
          this.productService.setSearchResults(results);
        });
    } else {
      // Si la búsqueda está vacía, limpiar los resultados
      this.productService.setSearchResults([]);
    }
  }
}
