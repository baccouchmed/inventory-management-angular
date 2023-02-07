import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { Notification } from 'app/layout/common/notifications/notifications.types';
import { map, switchMap, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private _notifications: ReplaySubject<Notification[]> = new ReplaySubject<Notification[]>(1);

  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for companies
   */
  get notifications$(): Observable<Notification[]> {
    return this._notifications.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get all companies
   */
  getAll(): Observable<Notification[]> {
    return this._httpClient.get<Notification[]>('api/common/companies').pipe(
      tap((notifications) => {
        this._notifications.next(notifications);
      }),
    );
  }

  /**
   * Create a notification
   *
   * @param notification
   */
  create(notification: Notification): Observable<Notification> {
    return this.notifications$.pipe(
      take(1),
      switchMap((notifications) =>
        this._httpClient.post<Notification>('api/common/companies', { notification }).pipe(
          map((newNotification) => {
            // Update the companies with the new notification
            this._notifications.next([...notifications, newNotification]);

            // Return the new notification from observable
            return newNotification;
          }),
        ),
      ),
    );
  }

  /**
   * Update the notification
   *
   * @param id
   * @param notification
   */
  update(id: string, notification: Notification): Observable<Notification> {
    return this.notifications$.pipe(
      take(1),
      switchMap((notifications) =>
        this._httpClient
          .patch<Notification>('api/common/companies', {
            id,
            notification,
          })
          .pipe(
            map((updatedNotification: Notification) => {
              // Find the index of the updated notification
              const index = notifications.findIndex((item) => item.id === id);

              // Update the notification
              notifications[index] = updatedNotification;

              // Update the companies
              this._notifications.next(notifications);

              // Return the updated notification
              return updatedNotification;
            }),
          ),
      ),
    );
  }

  /**
   * Delete the notification
   *
   * @param id
   */
  delete(id: string): Observable<boolean> {
    return this.notifications$.pipe(
      take(1),
      switchMap((notifications) =>
        this._httpClient.delete<boolean>('api/common/companies', { params: { id } }).pipe(
          map((isDeleted: boolean) => {
            // Find the index of the deleted notification
            const index = notifications.findIndex((item) => item.id === id);

            // Delete the notification
            notifications.splice(index, 1);

            // Update the companies
            this._notifications.next(notifications);

            // Return the deleted status
            return isDeleted;
          }),
        ),
      ),
    );
  }

  /**
   * Mark all companies as read
   */
  markAllAsRead(): Observable<boolean> {
    return this.notifications$.pipe(
      take(1),
      switchMap((notifications) =>
        this._httpClient.get<boolean>('api/common/companies/mark-all-as-read').pipe(
          map((isUpdated: boolean) => {
            // Go through all companies and set them as read
            notifications.forEach((notification, index) => {
              notifications[index].read = true;
            });

            // Update the companies
            this._notifications.next(notifications);

            // Return the updated status
            return isUpdated;
          }),
        ),
      ),
    );
  }
}
