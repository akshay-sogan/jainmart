import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GlossaryItem } from '../models/selection.model';

export interface Shopkeeper {
  id: string;
  name: string;
  email: string;
  mobileNumber: string | null;
  enabled: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ShopkeeperAdminService {
  private readonly shopkeepersUrl = `${environment.apiUrl}/admin/shopkeepers`;

  constructor(private http: HttpClient) { }

  getShopkeepers(): Observable<Shopkeeper[]> {
    return this.http.get<Shopkeeper[]>(this.shopkeepersUrl, { withCredentials: true });
  }

  getProducts(id: string): Observable<GlossaryItem[]> {
    return this.http.get<GlossaryItem[]>(
      `${environment.apiUrl}/products/shopkeeper/${encodeURIComponent(id)}`,
      { withCredentials: true }
    );
  }

  setEnabled(id: string, enabled: boolean): Observable<Shopkeeper> {
    return this.http.put<Shopkeeper>(
      `${this.shopkeepersUrl}/${encodeURIComponent(id)}/status`,
      { enabled },
      { withCredentials: true }
    );
  }
}
