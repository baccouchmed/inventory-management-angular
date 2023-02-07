import { Injectable } from '@angular/core';
import { ThirdParty } from '../models/third-party';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pagination } from '../models/pagination';
import { Contact } from '../models/contact';
import { ThirdPartySite } from '../models/third-party-site';
@Injectable({
  providedIn: 'root',
})
export class ThirdPartyService {
  endpoint = `${environment.api}/thirdparty`;

  constructor(private http: HttpClient) {}
  // add new thirdparty
  createThirdParty(
    thirdParty: ThirdParty,
  ): Observable<ThirdParty> {
    return this.http.post<ThirdParty>(`${this.endpoint}`, {
      thirdParty,
    });
  }
  // get thirdparty
  getThirdParty(
    limit,
    page,
    sortCode,
    sortName,
    sortType,
    search,
    statusSort,
  ): Observable<Pagination<ThirdParty>> {
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
    if (sortType) {
      searchParams = searchParams.append('sortType', sortType);
    }
    searchParams = searchParams.append('statusSort', statusSort);
    return this.http.get<Pagination<ThirdParty>>(`${this.endpoint}`, {
      params: searchParams,
    });
  }
  getOneThirdParty(id: string): Observable<ThirdParty> {
    return this.http.get<ThirdParty>(`${this.endpoint}/${id}`);
  }
  deleteThirdParty(id): Observable<null> {
    return this.http.delete<null>(`${this.endpoint}/${id}`);
  }
  getAllThirdParty(): Observable<ThirdParty[]> {
    return this.http.get<ThirdParty[]>(`${this.endpoint}/list-third-party`);
  }
  getThirdPartyList(value: string): Observable<ThirdParty[]> {
    return this.http.get<ThirdParty[]>(`${this.endpoint}/${value}/list-third-party`);
  }
  getCode(id): Observable<string> {
    return this.http.get<string>(`${this.endpoint}/${id}/code`);
  }
  getContactCode(index): Observable<string> {
    return this.http.post<string>(`${this.endpoint}/contact/code`, { index });
  }
  // get third party
  getSingelThirdParty(id: string): Observable<ThirdParty> {
    return this.http.get<ThirdParty>(`${this.endpoint}/${id}`);
  }
  //get singel contact
  getSinglContact(id: string): Observable<Contact> {
    return this.http.get<Contact>(`${this.endpoint}/${id}/single-contact`);
  }

  getContact(id): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.endpoint}/${id}/contact`);
  }
  getSite(id): Observable<ThirdPartySite[]> {
    return this.http.get<ThirdPartySite[]>(`${this.endpoint}/${id}/thirdPartySite`);
  }
  getSites(id): Observable<ThirdPartySite[]> {
    return this.http.get<ThirdPartySite[]>(`${this.endpoint}/${id}/sites`);
  }
  getContacts(id): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.endpoint}/${id}/contacts`);
  }
  updateThirdParty(
    thirdParty: ThirdParty
  ): Observable<null> {
    return this.http.patch<null>(`${this.endpoint}`, {
      thirdParty
    });
  }
}
