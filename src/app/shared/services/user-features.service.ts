import { Injectable } from '@angular/core';
import { Group } from '../models/group';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Pagination } from '../models/pagination';
import { UserFeature } from '../models/user-feature';
@Injectable({
  providedIn: 'root',
})
export class UserFeaturesService {
  endpoint = `${environment.api}/userfeatures`;

  constructor(private http: HttpClient) {}

  creatUserFeatures(user: User, userFeature): Observable<User> {
    return this.http.post<User>(`${this.endpoint}`, { user, userFeature });
  }
  //delete user
  deleteUser(id): Observable<null> {
    return this.http.delete<null>(`${this.endpoint}/${id}`);
  }
  // get group Group
  getGroup(id: string): Observable<Group> {
    return this.http.get<Group>(`${this.endpoint}/${id}`);
  }
  // get feature group
  getUserFeatures(id): Observable<UserFeature[]> {
    return this.http.get<UserFeature[]>(`${this.endpoint}/${id}/user-features`);
  }
  //update group
  updateUser(userFeature): Observable<UserFeature[]> {
    return this.http.patch<UserFeature[]>(`${this.endpoint}`, { userFeature });
  }
  getUserWithoutFeatures(): Observable<User[]> {
    return this.http.get<User[]>(`${this.endpoint}/user-without-features`);
  }
  getUserWithFeatures(
    limit,
    page,
    sortCode,
    sortName,
    sortEmail,
    search,
    userFeatureId,
  ): Observable<Pagination<User>> {
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
    if (sortEmail) {
      searchParams = searchParams.append('sortEmail', sortEmail);
    }
    searchParams = searchParams.append('userFeatureId', userFeatureId);
    return this.http.get<Pagination<User>>(`${this.endpoint}/user-with-features`, {
      params: searchParams,
    });
  }
}
