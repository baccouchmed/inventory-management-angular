import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Pagination } from '../models/pagination';
import { Company } from '../models/company';
import { Country, Governorate } from '../models/country';
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
  getCompanies(
    limit,
    page,
    sortCode,
    sortName,
    search,
    country,
    governorate,
    municipality,
    status,
  ): Observable<Pagination<Company>> {
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
    if (country) {
      searchParams = searchParams.append('country', country);
    }
    if (governorate) {
      searchParams = searchParams.append('governorate', governorate);
    }
    if (municipality) {
      searchParams = searchParams.append('municipality', municipality);
    }
    if (status) {
      searchParams = searchParams.append('status', status);
    }
    return this.http.get<Pagination<Company>>(`${this.endpoint}`, {
      params: searchParams,
    });
  }
  getContracts(
    limit,
    page,
    sortCode,
    sortName,
    search,
    country,
    governorate,
    municipality,
    typeCompany,
    statusContract,
  ): Observable<Pagination<Company>> {
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
    if (country) {
      searchParams = searchParams.append('country', country);
    }
    if (governorate) {
      searchParams = searchParams.append('governorate', governorate);
    }
    if (municipality) {
      searchParams = searchParams.append('municipality', municipality);
    }
    if (typeCompany) {
      searchParams = searchParams.append('typeCompany', typeCompany);
    }
    if (statusContract) {
      searchParams = searchParams.append('statusContract', statusContract);
    }
    return this.http.get<Pagination<Company>>(`${this.endpoint}/contracts`, {
      params: searchParams,
    });
  }
  getValidateContracts(
    limit,
    page,
    sortCode,
    sortName,
    search,
    country,
    governorate,
    municipality,
    typeCompany,
  ): Observable<Pagination<Company>> {
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
    if (country) {
      searchParams = searchParams.append('country', country);
    }
    if (governorate) {
      searchParams = searchParams.append('governorate', governorate);
    }
    if (municipality) {
      searchParams = searchParams.append('municipality', municipality);
    }
    if (typeCompany) {
      searchParams = searchParams.append('typeCompany', typeCompany);
    }
    return this.http.get<Pagination<Company>>(`${this.endpoint}/validate-contracts`, {
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
  getGovernorates(id): Observable<Governorate[]> {
    return this.http.get<Governorate[]>(`${this.endpoint}/governorates/${id}`);
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
  validateCompany(id): Observable<null> {
    return this.http.get<null>(`${this.endpoint}/${id}/validate`);
  }
  rejectCompany(id): Observable<null> {
    return this.http.get<null>(`${this.endpoint}/${id}/reject`);
  }
  updateCompany(company: Company): Observable<null> {
    return this.http.patch<null>(`${this.endpoint}`, { company });
  }

  getListCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.endpoint}/all`);
  }
}
