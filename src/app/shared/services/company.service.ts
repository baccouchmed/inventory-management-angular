import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Pagination } from '../models/pagination';
import { Company } from '../models/company';
import { City } from '../models/city';
import { Country } from '../models/country';
import { Site } from '../models/site';
import { Currency } from '../models/currency';
import { UserSite } from '../models/user-site';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  endpoint = `${environment.api}/companies`;
  _company = new BehaviorSubject<Company>(null);
  _site = new BehaviorSubject<Site>(null);

  constructor(private http: HttpClient) {}

  // add new company
  createCompany(company: Company): Observable<Company> {
    return this.http.post<Company>(`${this.endpoint}`, { company });
  }
  // update logo company
  updateLogo(data: FormData, id): Observable<Company> {
    return this.http.post<Company>(`${this.endpoint}/${id}/logo`, data);
  }

  // get companies
  getCompanies(limit, page, sortCode, sortName, search): Observable<Pagination<Company>> {
    let searchParams = new HttpParams();
    searchParams = searchParams.append('limit', limit);
    searchParams = searchParams.append('page', page);
    if (search) {
      searchParams = searchParams.append('search', search);
    }
    if (sortCode) {
      searchParams = searchParams.append('sortCode', sortCode);
    }
    if (sortName) {
      searchParams = searchParams.append('sortName', sortName);
    }
    return this.http.get<Pagination<Company>>(`${this.endpoint}`, {
      params: searchParams,
    });
  }
  getCompany(id: string): Observable<Company> {
    return this.http.get<Company>(`${this.endpoint}/${id}`);
  }
  getSites(id): Observable<Site[]> {
    return this.http.get<Site[]>(`${this.endpoint}/${id}/sites`);
  }
  getSitesMenu(): Observable<Site[]> {
    return this.http.get<Site[]>(`${this.endpoint}/sites-menu`);
  }
  getSite(id): Observable<Site> {
    return this.http.get<Site>(`${this.endpoint}/${id}/site`);
  }
  getUserSite(id): Observable<UserSite> {
    return this.http.get<UserSite>(`${this.endpoint}/${id}/user-site`);
  }
  getUserSites(): Observable<UserSite[]> {
    return this.http.get<UserSite[]>(`${this.endpoint}/user-sites`);
  }
  getCities(id): Observable<City[]> {
    return this.http.get<City[]>(`${this.endpoint}/city/${id}`);
  }

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.endpoint}/country`);
  }
  getCurrencies(): Observable<Currency[]> {
    return this.http.get<Currency[]>(`${this.endpoint}/currency`);
  }

  deleteCompany(id): Observable<null> {
    return this.http.delete<null>(`${this.endpoint}/${id}`);
  }

  updateCompany(company: Company): Observable<null> {
    return this.http.patch<null>(`${this.endpoint}`, { company });
  }

  getListCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.endpoint}/all`);
  }
}
