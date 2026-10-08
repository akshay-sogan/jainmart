import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GlossaryItem } from '../models/selection.model';

export type NewProduct = Omit<GlossaryItem, 'id'>;

@Injectable({
  providedIn: 'root'
})
export class ProductCatalogService {
  private readonly productsUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  getProducts(): Observable<GlossaryItem[]> {
    return this.http.get<GlossaryItem[]>(this.productsUrl);
  }

  createProduct(product: NewProduct): Observable<GlossaryItem> {
    return this.http.post<GlossaryItem>(this.productsUrl, product, { withCredentials: true });
  }

  updateProduct(id: string, product: NewProduct): Observable<GlossaryItem> {
    return this.http.put<GlossaryItem>(`${this.productsUrl}/${encodeURIComponent(id)}`, product, {
      withCredentials: true
    });
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.productsUrl}/${encodeURIComponent(id)}`, {
      withCredentials: true
    });
  }
}
