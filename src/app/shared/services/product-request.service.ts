import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Pagination } from '../models/pagination';
import { ProductRequest } from '../models/inventory';

@Injectable({
  providedIn: 'root',
})
export class ProductRequestService {
  endpoint = `${environment.api}/product-request`;

  constructor(private http: HttpClient) {}
  // create category
  createProductRequest(productRequest): Observable<null> {
    return this.http.post<null>(`${this.endpoint}/`, {
      productRequest,
    });
  }
  updateQuantityRequested(requestId, id, quantityRequested): Observable<null> {
    return this.http.patch<null>(`${this.endpoint}/${requestId}/update-quantity/${id}`, {
      quantityRequested,
    });
  }
  updateQuantityValidated(requestId, id, quantityValidated): Observable<null> {
    return this.http.patch<null>(`${this.endpoint}/${requestId}/validate-quantity/${id}`, {
      quantityValidated,
    });
  }
  updateUnitPriceRequested(requestId, id, unitPriceRequested): Observable<null> {
    return this.http.patch<null>(`${this.endpoint}/${requestId}/unit-price-requested/${id}`, {
      unitPriceRequested,
    });
  }
  requestedValidate(requestId, productsId): Observable<null> {
    return this.http.patch<null>(`${this.endpoint}/${requestId}/requested-validate`, {
      productsId,
    });
  }
  requesterValidate(requestId): Observable<null> {
    return this.http.get<null>(`${this.endpoint}/${requestId}/requester-validate`);
  }
  requestedToDone(requestId): Observable<null> {
    return this.http.get<null>(`${this.endpoint}/${requestId}/requested-done`);
  }
  getMyRequests(limit, page, search, typeRequest): Observable<Pagination<ProductRequest>> {
    let searchParams = new HttpParams();
    searchParams = searchParams.append('limit', limit);
    searchParams = searchParams.append('page', page);
    if (search) {
      searchParams = searchParams.append('search', search);
    }
    if (typeRequest) {
      searchParams = searchParams.append('typeRequest', typeRequest);
    }
    return this.http.get<Pagination<ProductRequest>>(`${this.endpoint}`, {
      params: searchParams,
    });
  }
  downloadInvoice(token: string, id: string): string {
    return `${this.endpoint}/download-invoice?accessToken=${token}&id=${id}`;
  }
}
