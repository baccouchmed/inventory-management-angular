import { Injectable, Injector } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import get from 'lodash/get';
import { SnackBarService } from '../services/snack-bar.service';

@Injectable()
export class ApiErrorsInterceptor implements HttpInterceptor {
  snackBarService: SnackBarService;

  constructor(private injector: Injector) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        this.snackBarService = this.injector.get(SnackBarService);
        const status = get(error, 'status', null);
        const message = get(error.error, 'message', null);
        const messages = get(error, 'error.errors[0].msg', '');
        switch (status) {
          case 403:
          case '403':
            this.snackBarService.openSnackBar(message || messages || 'Not authorized');
            break;
          case 404:
          case '404':
            if (!error.url.includes('/internationalization/')) {
              this.snackBarService.openSnackBar(message || messages || '404 Not found');
            }
            break;
          case 400:
          case '400':
            this.snackBarService.openSnackBar(message || messages || '400 Bad request');
            break;
          default:
            if (!error.url.includes('/internationalization/')) {
              this.snackBarService.openSnackBar(
                message || messages || `${status || ''} Service problem`,
              );
            }
        }
        return throwError(error);
      }),
    );
  }
}
