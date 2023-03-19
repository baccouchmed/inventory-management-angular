import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/inventory';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  endpoint = `${environment.api}/inventory`;

  constructor(private http: HttpClient) {}

  updateStock(id, quantityIn, unitPrice): Observable<null> {
    return this.http.patch<null>(`${this.endpoint}/stocks/${id}/add`, {
      quantityIn,
      unitPrice,
    });
  }
  updateStore(id, status): Observable<null> {
    return this.http.patch<null>(`${this.endpoint}/store/${id}`, {
      disable: status,
    });
  }
  deductStock(id, quantityOut): Observable<null> {
    return this.http.patch<null>(`${this.endpoint}/stocks/${id}/deduct`, {
      quantityOut,
    });
  }
  updatePrice(id, price): Observable<null> {
    return this.http.patch<null>(`${this.endpoint}/stocks/${id}/price`, {
      price,
    });
  }
  updateMinStock(id, minStock): Observable<null> {
    return this.http.patch<null>(`${this.endpoint}/stocks/${id}/min-stock`, {
      minStock,
    });
  }
  createProduct(product: Product): Observable<null> {
    return this.http.post<null>(`${this.endpoint}/create-product`, { product });
  }
}
