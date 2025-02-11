import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';

interface Category {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'https://rposhop-backend-latest.onrender.com/api/categories';

  // BehaviorSubject para actualizar las categorías en tiempo real
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  loadCategories(): void {
    this.http.get<Category[]>(this.apiUrl).subscribe({
      next: (categories) => this.categoriesSubject.next(categories),
      error: (err) => console.error('Error al cargar categorías', err),
    });
  }

  addCategory(category: { name: string }): Observable<Category> {
    return this.http
      .post<Category>(this.apiUrl, category, { headers: this.getHeaders() })
      .pipe(
        tap(() => {
          this.loadCategories(); // Recargar la lista después de añadir
        }),
        catchError((error) => {
          console.error('Error al añadir categoría', error);
          return throwError(() => new Error('No se pudo añadir la categoría.'));
        })
      );
  }

  updateCategory(id: number, category: { name: string }): Observable<Category> {
    return this.http
      .put<Category>(`${this.apiUrl}/${id}`, category, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('Error al actualizar categoría', error);
          return throwError(
            () => new Error('No se pudo actualizar la categoría.')
          );
        })
      );
  }

  deleteCategory(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error al eliminar categoría', error);
          return throwError(
            () => new Error('No se pudo eliminar la categoría.')
          );
        })
      );
  }
}
