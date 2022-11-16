import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, finalize, retry} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Constant} from '../constants/constant.class';
import {LoaderService} from '../../service/loader.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private totalRequests = 0;
  constructor(private router: Router, private loaderService: LoaderService) {
  }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!req.headers.get('skipLoading')) {
      this.totalRequests++;
      this.loaderService.show();
    }
    return next.handle(req).pipe(
      retry(1),

      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          localStorage.removeItem(Constant.ACCESS_TOKEN);
          localStorage.removeItem(Constant.USER_INFO);
          const url = this.router.routerState.snapshot.url;
          this.router.navigate(['/login'], { queryParams: { returnUrl: url } });
          return throwError(error);
        } else if (error.status === 403) {
          this.router.navigate(['/unauthorized']);
          return throwError(error);
        } else if (error.status === 404) {
          this.router.navigate(['/page-not-found']);
        }
        return throwError(error);
      }),
       finalize(() => {
        if (!req.headers.get('skipLoading')) {
          this.totalRequests--;
        }
        if (this.totalRequests === 0) {
          this.loaderService.hide();
        }
      })
    );
  }
}
