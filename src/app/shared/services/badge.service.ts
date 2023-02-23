import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class BadgeService {
  endpoint = `${environment.api}/badges`;
  _badgeStock = new BehaviorSubject<number>(null);
  _badgeStore = new BehaviorSubject<number>(null);
  _badgeMyRequest = new BehaviorSubject<number>(null);
  _badgeStockRequest = new BehaviorSubject<number>(null);

  constructor(private http: HttpClient) {}
  set badgeStock(value: number) {
    // Store the value
    this._badgeStock.next(value);
  }
  get badgeStock$(): BehaviorSubject<number> {
    return this._badgeStock;
  }
  // add new country
  badgeStocks(): Observable<number> {
    return this.http.get<number>(`${this.endpoint}/stocks`).pipe(
      tap((badge) => {
        this._badgeStock.next(badge);
      }),
    );
  }
  set badgeMyRequest(value: number) {
    // Store the value
    this._badgeMyRequest.next(value);
  }
  get badgeMyRequest$(): BehaviorSubject<number> {
    return this._badgeMyRequest;
  }
  set badgeStockRequest(value: number) {
    // Store the value
    this._badgeStockRequest.next(value);
  }
  get badgeStockRequest$(): BehaviorSubject<number> {
    return this._badgeStockRequest;
  }
  badgeMyRequests(): Observable<number> {
    return this.http.get<number>(`${this.endpoint}/my-requests`).pipe(
      tap((badge) => {
        this._badgeMyRequest.next(badge);
      }),
    );
  }
  badgeStockRequests(): Observable<number> {
    return this.http.get<number>(`${this.endpoint}/stock-requests`).pipe(
      tap((badge) => {
        this._badgeStockRequest.next(badge);
      }),
    );
  }

  set badgeStore(value: number) {
    // Store the value
    this._badgeStore.next(value);
  }
  get badgeStore$(): BehaviorSubject<number> {
    return this._badgeStore;
  }
  // add new country
  badgeStores(): Observable<number> {
    return this.http.get<number>(`${this.endpoint}/stores`).pipe(
      tap((badge) => {
        this._badgeStore.next(badge);
      }),
    );
  }
}
