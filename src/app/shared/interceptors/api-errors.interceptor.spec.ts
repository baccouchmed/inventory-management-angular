import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ApiErrorsInterceptor } from './api-errors.interceptor';
import { SnackBarService } from '../services/snack-bar.service';

describe('ErrorHandlerService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ApiErrorsInterceptor,
          multi: true,
        },
        SnackBarService,
      ],
    }),
  );

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    // Finally, assert that there are no outstanding requests.
    httpMock.verify();
  }));

  it('should catchErrors when httpMock flush Error', fakeAsync(
    inject(
      [HttpClient, HttpTestingController],
      (http: HttpClient, httpMock: HttpTestingController) => {
        const snackBarService: SnackBarService = TestBed.inject(SnackBarService);

        const spy = spyOn(snackBarService, 'openSnackBar').and.callThrough();
        // http call
        http.get('/test').subscribe(
          () => {
            // do nothing
          },
          () => {
            // do nothing
          },
        );

        const mockErrorResponse: HttpErrorResponse = new HttpErrorResponse({ status: 503 });
        // flush the http call with mockErrorResponse
        httpMock.expectOne('/test').flush({}, mockErrorResponse);
        // wait the http call
        tick(500);

        expect(spy).toHaveBeenCalledWith('Erreur du serveur');
      },
    ),
  ));
});
