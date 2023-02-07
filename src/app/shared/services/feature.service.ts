import { Injectable } from '@angular/core';
import { Feature } from '../models/feature';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pagination } from '../models/pagination';
@Injectable({
  providedIn: 'root',
})
export class FeatureService {
  endpoint = `${environment.api}/features`;

  constructor(private http: HttpClient) {}
  // get features
  getFeatures(limit, page, sortCode, sortName, sortType, search): Observable<Pagination<Feature>> {
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
    return this.http.get<Pagination<Feature>>(`${this.endpoint}`, {
      params: searchParams,
    });
  }
  addFeature(feature: Feature): Observable<Feature> {
    return this.http.post<Feature>(`${this.endpoint}`, { feature });
  }
  getFeatureParent(): Observable<Feature[]> {
    return this.http.get<Feature[]>(`${this.endpoint}/parents`);
  }
  getAllFeature(): Observable<Feature[]> {
    return this.http.get<Feature[]>(`${this.endpoint}/group-features`);
  }
  deleteFeature(id): Observable<null> {
    return this.http.delete<null>(`${this.endpoint}/${id}`);
  }
  getFeature(id: string): Observable<Feature> {
    return this.http.get<Feature>(`${this.endpoint}/${id}`);
  }
  getFeatureByCode(link: string): Observable<Feature> {
    return this.http.post<Feature>(`${this.endpoint}/link`, { link });
  }
  updateFeature(feature: Feature): Observable<null> {
    return this.http.patch<null>(`${this.endpoint}`, { feature });
  }
}
