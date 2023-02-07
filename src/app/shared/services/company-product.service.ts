import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Pagination } from '../models/pagination';
import {
  CompanyProduct,
  CompanyProductTypeProduct,
  Product,
  ProductStock,
  TypeProduct,
} from '../models/inventory';

@Injectable({
  providedIn: 'root',
})
export class CompanyProductService {
  endpoint = `${environment.api}/companiesproducts`;

  constructor(private http: HttpClient) {}

  // add new company
  createCompany(
    company: CompanyProduct,
    typeProducts: TypeProduct[],
    products: Product[][],
  ): Observable<CompanyProduct> {
    return this.http.post<CompanyProduct>(`${this.endpoint}`, { company, typeProducts, products });
  }
  // update logo company
  updateLogo(data: FormData, id): Observable<CompanyProduct> {
    return this.http.post<CompanyProduct>(`${this.endpoint}/${id}/logo`, data);
  }
  updateProductLogo(data: FormData, id): Observable<Product> {
    return this.http.post<Product>(`${this.endpoint}/products/${id}/logo`, data);
  }
  // get companies
  getCompanies(limit, page, sortName, search): Observable<Pagination<CompanyProduct>> {
    let searchParams = new HttpParams();
    searchParams = searchParams.append('limit', limit);
    searchParams = searchParams.append('page', page);
    if (search) {
      searchParams = searchParams.append('search', search);
    }
    if (sortName) {
      searchParams = searchParams.append('sortName', sortName);
    }
    return this.http.get<Pagination<CompanyProduct>>(`${this.endpoint}`, {
      params: searchParams,
    });
  }
  getProducts(limit, page, search): Observable<Pagination<Product>> {
    let searchParams = new HttpParams();
    searchParams = searchParams.append('limit', limit);
    searchParams = searchParams.append('page', page);
    if (search) {
      searchParams = searchParams.append('search', search);
    }
    return this.http.get<Pagination<Product>>(`${this.endpoint}/products`, {
      params: searchParams,
    });
  }
  getProductStocks(limit, page, search): Observable<Pagination<ProductStock>> {
    let searchParams = new HttpParams();
    searchParams = searchParams.append('limit', limit);
    searchParams = searchParams.append('page', page);
    if (search) {
      searchParams = searchParams.append('search', search);
    }
    return this.http.get<Pagination<ProductStock>>(`${this.endpoint}/product-stocks`, {
      params: searchParams,
    });
  }
  getCompany(id: string): Observable<CompanyProduct> {
    return this.http.get<CompanyProduct>(`${this.endpoint}/${id}`);
  }

  deleteCompany(id): Observable<null> {
    return this.http.delete<null>(`${this.endpoint}/${id}`);
  }

  updateCompany(
    company: CompanyProduct,
    typeProducts: TypeProduct[],
    products: Product[][],
  ): Observable<null> {
    return this.http.patch<null>(`${this.endpoint}`, { company, typeProducts, products });
  }

  getListCompanies(): Observable<CompanyProduct[]> {
    return this.http.get<CompanyProduct[]>(`${this.endpoint}/all`);
  }
  getTypeProduct(id): Observable<TypeProduct[]> {
    return this.http.get<TypeProduct[]>(`${this.endpoint}/${id}/type-product`);
  }
  createTypeProduct(stages: TypeProduct[]): Observable<null> {
    return this.http.post<null>(`${this.endpoint}/type-product`, { stages });
  }
  getTypeProducts(limit, page, sortLabel, search): Observable<Pagination<TypeProduct>> {
    let searchParams = new HttpParams();
    searchParams = searchParams.append('limit', limit);
    searchParams = searchParams.append('page', page);
    if (search) {
      searchParams = searchParams.append('search', search);
    }
    if (sortLabel) {
      searchParams = searchParams.append('sortName', sortLabel);
    }
    return this.http.get<Pagination<TypeProduct>>(`${this.endpoint}/type-product`, {
      params: searchParams,
    });
  }
  // delete stage
  deleteTypeProduct(id): Observable<null> {
    return this.http.delete<null>(`${this.endpoint}/type-product/${id}`);
  }
  // add new stage
  getAllTypeProducts(): Observable<TypeProduct[]> {
    return this.http.get<TypeProduct[]>(`${this.endpoint}/type-product/all`);
  }
  // update stage
  updateTypeProduct(stage: TypeProduct): Observable<null> {
    return this.http.patch<null>(`${this.endpoint}/type-product`, { stage });
  }
  getCompanyTypeProduct(id: string): Observable<any> {
    return this.http.get<any>(`${this.endpoint}/${id}/Type-products`);
  }
}
