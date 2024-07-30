import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, catchError, switchMap, throwError } from "rxjs";
import { TransactionHandlerService } from "src/app/shared/services/transaction-handler.service";
import { MasterDataService } from "src/app/shared/services/master-data.service";
import { Router } from "@angular/router";

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
  constructor(
    private transactionHandler: TransactionHandlerService,
    private masterData: MasterDataService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            return this.handleUnAuthorizedError(request, next);
          }
        }
        return throwError(() => err);
      })
    );
  }

  handleUnAuthorizedError(req: HttpRequest<any>, next: HttpHandler) {
    let body = {
      refresh_token: this.masterData.RefreshToken,
      HotelId: this.masterData.HotelId,
      grant_type: "refresh_token",
    };
    return this.transactionHandler.RefreshToken(body).pipe(
      switchMap((data: any) => {
        // this.masterData.SessionKey = data.dataSet.accessToken;
        // this.masterData.RefreshToken = data.dataSet.refreshToken;
        return next.handle(req);
      }),
      catchError((err) => {
        return throwError(() => {
          this.router.navigate(["/login"]);
          this.masterData.clearLoginData();
          return;
        });
      })
    );
  }
}
