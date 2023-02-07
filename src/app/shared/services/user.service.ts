import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import jwtDecode, { JwtPayload } from 'jwt-decode';

import { environment } from '../../../environments/environment';
import { User } from '../models/user';
import { Pagination } from '../models/pagination';
import { UserSite } from '../models/user-site';
import { Site } from '../models/site';
import { map, tap } from 'rxjs/operators';
import { FeatureAuth } from '../models/feature-auth';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  endpoint = `${environment.api}/users`;
  keyAccessToken = 'access_token';
  keyOriginRoute = 'origin_route';
  _user = new BehaviorSubject<User>(null);
  _defaultLink = new BehaviorSubject<string>(null);
  _features: BehaviorSubject<FeatureAuth[]> = new BehaviorSubject<FeatureAuth[]>(null);

  constructor(private http: HttpClient, private router: Router) {}
  set user(value: User) {
    // Store the value
    this._user.next(value);
  }
  get user$(): Observable<User> {
    return this._user.asObservable();
  }

  set defaultLink(value: string) {
    // Store the value
    this._defaultLink.next(value);
  }
  get defaultLink$(): BehaviorSubject<string> {
    return this._defaultLink;
  }

  set features(value: FeatureAuth[]) {
    // Store the value
    this._features.next(value);
  }

  get features$(): BehaviorSubject<FeatureAuth[]> {
    return this._features;
  }
  checkPermission(permissions: FeatureAuth[]): boolean {
    const featuresAuth: FeatureAuth[] = this.features$.getValue();
    let permission: FeatureAuth;
    for (permission of permissions) {
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      const fa: FeatureAuth = featuresAuth.find((fau: FeatureAuth) => fau.code === permission.code);
      if (!fa) {
        return false;
      }
      let permissionAction;
      for (permissionAction of permission.actions) {
        if (!fa.actions.includes(permissionAction)) {
          return false;
        }
      }
    }
    return true;
  }

  get(): Observable<User> {
    return this.http.get<User>(`${this.endpoint}/me`).pipe(
      tap((user) => {
        this._user.next(user);
      }),
    );
  }
  // ********************* Password & Code *************//
  changePassword(
    password: string,
    newPassword: string,
    code: string,
    id: string,
  ): Observable<null> {
    return this.http.post<null>(`${this.endpoint}/${id}/change-password`, {
      password,
      newPassword,
      code,
    });
  }
  checkPassword(password: string): Observable<null> {
    return this.http.post<null>(`${this.endpoint}/check-password`, {
      password,
    });
  }
  sendCode(id: string, password: string, newPassword: string): Observable<null> {
    return this.http.post<null>(`${this.endpoint}/${id}/send-code`, {
      password,
      newPassword,
    });
  }
  resendCode(id: string, params: any): Observable<null> {
    return this.http.patch<null>(`${this.endpoint}/${id}/resend-code`, {
      params,
    });
  }

  // ******************* My info **************************** //
  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.endpoint}/me`);
  }
  updatePersonalInfo(user: User): Observable<User> {
    return this.http.post<User>(`${this.endpoint}/personal-info`, user);
  }
  getMySites(): Observable<Site[]> {
    return this.http.get<Site[]>(`${this.endpoint}/me/sites`);
  }
  updateMyAvatar(data: FormData): Observable<User> {
    return this.http.post<User>(`${this.endpoint}/my-avatar`, data).pipe(
      tap((user) => {
        this._user.next(user);
      }),
    );
  }

  // ******************* Users info **************************** //
  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.endpoint}`, {
      user,
    });
  }
  getUsers(limit, page, search, sortCode, sortName): Observable<Pagination<User>> {
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
    return this.http.get<Pagination<User>>(`${this.endpoint}`, {
      params: searchParams,
    });
  }
  getSingleUserProfile(id: string): Observable<User> {
    return this.http.get<User>(`${this.endpoint}/${id}`);
  }
  updateUser(user: User): Observable<User> {
    return this.http.patch<User>(`${this.endpoint}/${user._id}`, { user });
  }
  enableAccount(id: string): Observable<User> {
    return this.http.get<User>(`${this.endpoint}/${id}/enable-disable`);
  }
  getSites(id): Observable<Site[]> {
    return this.http.get<Site[]>(`${this.endpoint}/${id}/sites`);
  }
  deleteUser(id): Observable<null> {
    return this.http.delete<null>(`${this.endpoint}/${id}`);
  }
  updateAvatar(data: FormData, id: string): Observable<User> {
    return this.http.post<User>(`${this.endpoint}/${id}/avatar`, data).pipe(
      tap((user) => {
        this._user.next(user);
      }),
    );
  }
  getUserSites(id): Observable<UserSite[]> {
    return this.http.get<UserSite[]>(`${this.endpoint}/${id}/user-sites`);
  }
  updateState(user: User): Observable<any> {
    return this.http.patch<User>(`${this.endpoint}/state`, { user }).pipe(
      map((response) => {
        this._user.next(response);
      }),
    );
  }

  // *********************** TOKEN ******************************//
  decodeToken(token: string): JwtPayload {
    try {
      return jwtDecode(token);
    } catch (e) {
      console.error(e);
      this.doLogout();
      return null;
    }
  }
  getToken(): string {
    return localStorage.getItem(this.keyAccessToken);
  }
  deleteToken(): void {
    localStorage.removeItem(this.keyAccessToken);
  }
  doLogout(): Observable<boolean> {
    // Remove the access token from the local storage
    localStorage.removeItem('accessToken');

    // Return the observable
    return of(true);
  }
  isTokenExpired(expiryTime: number): boolean {
    if (expiryTime) {
      return expiryTime - new Date().getTime() / 1000 <= 5;
    }
    return false;
  }
}
