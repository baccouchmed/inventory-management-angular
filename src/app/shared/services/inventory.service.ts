import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ParamProject } from '../models/paramProject';
import { Pagination } from '../models/pagination';
import { Feature } from '../models/feature';
import { Category, Product, Subcategory } from '../models/inventory';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  endpoint = `${environment.api}/inventory`;

  constructor(private http: HttpClient) {}
  // create category
  createInventory(category, subcategories, products): Observable<null> {
    return this.http.post<null>(`${this.endpoint}/categories`, {
      category,
      subcategories,
      products,
    });
  }
  // update category
  updateStock(id, quantityIn, unitPrice): Observable<null> {
    return this.http.patch<null>(`${this.endpoint}/stocks/${id}/add`, {
      quantityIn,
      unitPrice,
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
  // get category
  getCategory(id): Observable<Category> {
    return this.http.get<Category>(`${this.endpoint}/categories/${id}`);
  }
  // get subcategories
  getSubcategories(id): Observable<Subcategory[]> {
    return this.http.get<Subcategory[]>(`${this.endpoint}/subcategories/${id}`);
  }
  // get subcategories
  getProducts(id): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.endpoint}/products/${id}`);
  }
  // get paginated categories
  getCategories(limit, page, sortName, search): Observable<Pagination<Feature>> {
    let searchParams = new HttpParams();
    searchParams = searchParams.append('limit', limit);
    searchParams = searchParams.append('page', page);
    if (search) {
      searchParams = searchParams.append('search', search);
    }
    if (sortName) {
      searchParams = searchParams.append('sortName', sortName);
    }
    return this.http.get<Pagination<Feature>>(`${this.endpoint}/categories`, {
      params: searchParams,
    });
  }
}
