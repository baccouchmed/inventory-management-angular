import { Injectable } from '@angular/core';
import { TypeThirdParty } from '../models/third-party-type';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pagination } from '../models/pagination';
@Injectable({
  providedIn: 'root',
})
export class TypeThirdPartyService {
  endpoint = `${environment.api}/typethirdparty`;

  constructor(private http: HttpClient) {}
  // get TypeThirdParty
  getTypeThirdParty(
    limit,
    page,
    sortCode,
    sortName,
    search,
  ): Observable<Pagination<TypeThirdParty>> {
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
    return this.http.get<Pagination<TypeThirdParty>>(`${this.endpoint}`, {
      params: searchParams,
    });
  }
  // add type third party
  createTypeThirdParty(typeThirdParty: TypeThirdParty): Observable<TypeThirdParty> {
    return this.http.post<TypeThirdParty>(`${this.endpoint}`, { typeThirdParty });
  }
  // update type third party
  updateTypeThirdParty(typeThirdParty: TypeThirdParty): Observable<TypeThirdParty> {
    return this.http.patch<TypeThirdParty>(`${this.endpoint}`, { typeThirdParty });
  }
  deleteTypeThirdParty(id): Observable<null> {
    return this.http.delete<null>(`${this.endpoint}/${id}`);
  }
  getAllTypeThirdParty(): Observable<TypeThirdParty[]> {
    return this.http.get<TypeThirdParty[]>(`${this.endpoint}/list-Type-third-party`);
  }
}
