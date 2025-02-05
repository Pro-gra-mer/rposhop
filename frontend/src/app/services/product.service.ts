import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { Product } from '../models/Product';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/products';
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();
  private searchResultsSubject = new BehaviorSubject<Product[]>([]);
  searchResults$ = this.searchResultsSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  loadProducts(): void {
    this.http.get<Product[]>(this.apiUrl).subscribe({
      next: (prods) => this.productsSubject.next(prods),
      error: (err) => console.error('Error al cargar productos', err),
    });
  }

  addProduct(product: Product): Observable<Product> {
    return this.http
      .post<Product>(this.apiUrl, product, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error al añadir producto', error);
          return throwError(() => new Error('No se pudo añadir el producto.'));
        })
      );
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http
      .put<Product>(`${this.apiUrl}/${id}`, product, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('Error al actualizar producto', error);
          return throwError(
            () => new Error('No se pudo actualizar el producto.')
          );
        })
      );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error al eliminar producto', error);
          return throwError(
            () => new Error('No se pudo eliminar el producto.')
          );
        })
      );
  }

  // product.service.ts
  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.http
      .get<Product[]>(`${this.apiUrl}/category/${categoryId}`)
      .pipe(
        catchError((error) => {
          console.error('Error al cargar productos por categoría', error);
          return throwError(
            () =>
              new Error('No se pudieron cargar los productos por categoría.')
          );
        })
      );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al cargar el producto', error);
        return throwError(() => new Error('No se pudo cargar el producto.'));
      })
    );
  }

  setSearchResults(results: Product[]): void {
    this.searchResultsSubject.next(results);
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.http
      .get<Product[]>(`${this.apiUrl}/search?query=${query}`)
      .pipe(
        catchError((error) => {
          console.error('Error al buscar productos', error);
          return throwError(
            () => new Error('No se pudo realizar la búsqueda.')
          );
        })
      );
  }
}
