import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ParamProject } from '../models/paramProject';

@Injectable({
  providedIn: 'root',
})
export class ParamProjectService {
  endpoint = `${environment.api}/paramProject`;

  constructor(private http: HttpClient) {}
  getParamProject(): Observable<ParamProject> {
    return this.http.get<ParamProject>(`${this.endpoint}`);
  }
  // update paramProject
  updateParam(paramProject: ParamProject): Observable<null> {
    return this.http.patch<null>(`${this.endpoint}`, { paramProject });
  }
  getConfirmationCodeAttempt(): Observable<null> {
    return this.http.get<null>(`${this.endpoint}/confirmationCodeAttempt`);
  }
}
