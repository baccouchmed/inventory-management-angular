import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ContractService {
  endpoint = `${environment.api}/contracts`;
  constructor(private http: HttpClient) {}

  // add new country
  createContract(company: string): Observable<null> {
    return this.http.post<null>(`${this.endpoint}`, { company });
  }
  refreshContract(company: string): Observable<null> {
    return this.http.post<null>(`${this.endpoint}/refresh`, { company });
  }
  revokeContract(company: string): Observable<null> {
    return this.http.post<null>(`${this.endpoint}/revoke`, { company });
  }
  validateContract(company: string): Observable<null> {
    return this.http.post<null>(`${this.endpoint}/validate`, { company });
  }
}
