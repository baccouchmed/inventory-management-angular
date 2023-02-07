import { Injectable } from '@angular/core';
import { Group } from '../models/group';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pagination } from '../models/pagination';
import { User } from '../models/user';
import { GroupFeature } from '../models/group-feature';
@Injectable({
  providedIn: 'root',
})
export class GroupService {
  endpoint = `${environment.api}/groups`;
  endpointTMS = `${environment.services.tms.url}/groups`;

  constructor(private http: HttpClient) {}
  // get groups
  getGroups(limit, page, sortCode, sortName, search): Observable<Pagination<Group>> {
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
    return this.http.get<Pagination<Group>>(`${this.endpoint}`, {
      params: searchParams,
    });
  }
  deletegroup(id): Observable<null> {
    return this.http.delete<null>(`${this.endpoint}/${id}`);
  }
  // creat Group
  creatGroup(group: Group, groupFeature): Observable<User> {
    return this.http.post<User>(`${this.endpoint}`, { group, groupFeature });
  }
  // get group
  getGroup(id: string): Observable<Group> {
    return this.http.get<Group>(`${this.endpoint}/${id}`);
  }
  // get feature group
  getFeatureGroup(id): Observable<GroupFeature[]> {
    return this.http.get<GroupFeature[]>(`${this.endpoint}/${id}/group-feature`);
  }
  //update group
  updateUser(group: Group, groupFeature): Observable<Group> {
    return this.http.patch<Group>(`${this.endpoint}/${group._id}`, { group, groupFeature });
  }
  //get list group
  getAllGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.endpoint}/list-groups`);
  }
  /******************************** TNS API ********************************************/
  // get feature group
  getFeatureGroupTMS(id): Observable<GroupFeature[]> {
    return this.http.get<GroupFeature[]>(`${this.endpointTMS}/${id}/group-feature`);
  }
}
