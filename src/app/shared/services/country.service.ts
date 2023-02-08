import { Injectable } from '@angular/core';
import { Country } from '../models/country';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pagination } from '../models/pagination';
import { City } from '../models/city';
import { Delegation } from '../models/delegation';
@Injectable({
  providedIn: 'root',
})
export class CountryService {
  endpoint = `${environment.api}/countries`;

  constructor(private http: HttpClient) {}
  // get countries
  getCountries(limit, page, sortCode, sortName, search): Observable<Pagination<Country>> {
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
    return this.http.get<Pagination<Country>>(`${this.endpoint}`, {
      params: searchParams,
    });
  }
  // delete country
  deleteCountry(id): Observable<null> {
    return this.http.delete<null>(`${this.endpoint}/${id}`);
  }
  // add new country
  createCountry(
    country: Country,
    delegations: Delegation[],
    cities: City[][],
  ): Observable<Country> {
    return this.http.post<Country>(`${this.endpoint}`, { country, cities });
  }
  // get country
  getCountry(id: string): Observable<Country> {
    return this.http.get<Country>(`${this.endpoint}/${id}`);
  }
  // get cities
  getCities(id): Observable<City[]> {
    return this.http.get<City[]>(`${this.endpoint}/${id}/cities`);
  }
  // update country
  updateCountry(country: Country, cities: City[], deletedCities: string[]): Observable<null> {
    return this.http.patch<null>(`${this.endpoint}`, { country, cities, deletedCities });
  }
}
