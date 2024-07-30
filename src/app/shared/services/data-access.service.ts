import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { MasterDataService } from "./master-data.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class DataAccessService {
  public Request: BehaviorSubject<number> = new BehaviorSubject(0);
  private RequestCount = 0;
  baseURL: string = environment.apiURL;

  constructor(
    private http: HttpClient,
    private masterData: MasterDataService
  ) {}

  GETALL(url: string, spinner = true): Observable<GetAllAppResponse> {
    let responseModel = new GetAllAppResponse();
    let serviceURL = this.baseURL;
    if (serviceURL == null) {
      responseModel.Errors = ["Please Configure Application Settings!!"];
      responseModel.IsSuccessful = false;
      responseModel.IsDBAccessible = false;
      return of(responseModel);
    } else {
      url = serviceURL + url;
    }
    if (spinner) {
      this.Request.next(++this.RequestCount);
    }

    let headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + this.masterData.SessionKey
    );

    return this.http.get<GetAllAppResponse>(url, { headers }).pipe(
      map((response) => {
        if (spinner) {
          this.Request.next(--this.RequestCount);
        }
        return this.mapToGetAllResponse(response);
      }),
      catchError((error) => {
        if (spinner) {
          this.Request.next(--this.RequestCount);
        }
        responseModel = this.mapToGetAllResponse(error.error);
        return of(responseModel);
      })
    );
  }

  GET(url: string, spinner = true): Observable<AppResponse> {
    let responseModel = new AppResponse();
    let serviceURL = this.baseURL;
    if (serviceURL == null) {
      responseModel.Errors = ["Please Configure Application Settings!!"];
      responseModel.IsSuccessful = false;
      return of(responseModel);
    } else {
      url = serviceURL + url;
    }
    if (spinner) {
      this.Request.next(++this.RequestCount);
    }

    let headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + this.masterData.SessionKey
    );
    return this.http.get<AppResponse>(url, { headers }).pipe(
      map((response) => {
        if (spinner) {
          this.Request.next(--this.RequestCount);
        }
        return this.mapToAppResponse(response);
      }),
      catchError((error) => {
        if (spinner) {
          this.Request.next(--this.RequestCount);
        }
        responseModel = this.mapToAppResponse(error.error);
        return of(responseModel);
      })
    );
  }

  POST(url: string, body: any, spinner = true): Observable<AppResponse> {
    let responseModel = new AppResponse();
    let serviceURL = this.baseURL;
    if (serviceURL == null) {
      responseModel.Errors = ["Please Configure Application Settings!!"];
      responseModel.IsSuccessful = false;
      return of(responseModel);
    } else {
      url = serviceURL + url;
    }
    if (spinner) {
      this.Request.next(++this.RequestCount);
    }

    let headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + this.masterData.SessionKey
    );

    return this.http.post<AppResponse>(url, body, { headers }).pipe(
      map((response) => {
        if (spinner) {
          this.Request.next(--this.RequestCount);
        }
        return this.mapToAppResponse(response);
      }),
      catchError((error) => {
        if (spinner) {
          this.Request.next(--this.RequestCount);
        }

        responseModel = this.mapToAppResponse(error.error);
        return of(responseModel);
      })
    );
  }

  PATCH(url: string, body: any, spinner = true): Observable<AppResponse> {
    let responseModel = new AppResponse();
    let serviceURL = this.baseURL;
    if (serviceURL == null) {
      responseModel.Errors = ["Please Configure Application Settings!!"];
      responseModel.IsSuccessful = false;
      return of(responseModel);
    } else {
      url = serviceURL + url;
    }
    if (spinner) {
      this.Request.next(++this.RequestCount);
    }

    let headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + this.masterData.SessionKey
    );
    return this.http.patch<AppResponse>(url, body, { headers }).pipe(
      map((response) => {
        if (spinner) {
          this.Request.next(--this.RequestCount);
        }
        return this.mapToAppResponse(response);
      }),
      catchError((error) => {
        if (spinner) {
          this.Request.next(--this.RequestCount);
        }
        responseModel = this.mapToAppResponse(error.error);
        return of(responseModel);
      })
    );
  }

  PUT(url: string, body: any, spinner = true): Observable<AppResponse> {
    let responseModel = new AppResponse();
    let serviceURL = this.baseURL;
    if (serviceURL == null) {
      responseModel.Errors = ["Please Configure Application Settings!!"];
      responseModel.IsSuccessful = false;
      return of(responseModel);
    } else {
      url = serviceURL + url;
    }
    if (spinner) {
      this.Request.next(++this.RequestCount);
    }

    let headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + this.masterData.SessionKey
    );
    return this.http.put<AppResponse>(url, body, { headers }).pipe(
      map((response) => {
        if (spinner) {
          this.Request.next(--this.RequestCount);
        }
        return this.mapToAppResponse(response);
      }),
      catchError((error) => {
        if (spinner) {
          this.Request.next(--this.RequestCount);
        }
        responseModel = this.mapToAppResponse(error.error);
        return of(responseModel);
      })
    );
  }

  DELETE(url: string, spinner = true): Observable<AppResponse> {
    let responseModel = new AppResponse();
    let serviceURL = this.baseURL;
    if (serviceURL == null) {
      responseModel.Errors = ["Please Configure Application Settings!!"];
      responseModel.IsSuccessful = false;
      return of(responseModel);
    } else {
      url = serviceURL + url;
    }
    if (spinner) {
      this.Request.next(++this.RequestCount);
    }

    let headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + this.masterData.SessionKey
    );
    return this.http.delete<AppResponse>(url, { headers }).pipe(
      map((response) => {
        if (spinner) {
          this.Request.next(--this.RequestCount);
        }
        return this.mapToAppResponse(response);
      }),
      catchError((error) => {
        if (spinner) {
          this.Request.next(--this.RequestCount);
        }
        responseModel = this.mapToAppResponse(error.error);
        return of(responseModel);
      })
    );
  }

  _POST(url: string, body: any, spinner = true): Observable<AppResponse> {
    let responseModel = new AppResponse();
    let serviceURL = this.baseURL;
    if (serviceURL == null) {
      responseModel.Errors = ["Please Configure Application Settings!!"];
      responseModel.IsSuccessful = false;
      return of(responseModel);
    } else {
      url = serviceURL + url;
    }
    if (spinner) {
      this.Request.next(++this.RequestCount);
    }
    return this.http.post<AppResponse>(url, body).pipe(
      map((response) => {
        if (spinner) {
          this.Request.next(--this.RequestCount);
        }
        return this.mapToAppResponse(response);
      }),
      catchError((error) => {
        if (spinner) {
          this.Request.next(--this.RequestCount);
        }
        responseModel = this.mapToAppResponse(error.error);
        return of(responseModel);
      })
    );
  }

  AUTH_POST(url: string, body: any, spinner = true): Observable<AppResponse> {
    let responseModel = new AppResponse();
    let serviceURL = this.baseURL;
    if (serviceURL == null) {
      responseModel.Errors = ["Please Configure Application Settings!!"];
      responseModel.IsSuccessful = false;
      return of(responseModel);
    } else {
      url = serviceURL + url;
    }
    if (spinner) {
      this.Request.next(++this.RequestCount);
    }
    return this.http.post<AppResponse>(url, body).pipe(
      map((response) => {
        if (spinner) {
          this.Request.next(--this.RequestCount);
        }
        return response;
      }),
      catchError((error) => {
        if (spinner) {
          this.Request.next(--this.RequestCount);
        }
        responseModel = this.mapToAppResponse(error.error);
        return of(responseModel);
      })
    );
  }

  _GET(url: string, spinner = true): Observable<AppResponse> {
    let responseModel = new AppResponse();
    let serviceURL = this.baseURL;
    if (serviceURL == null) {
      responseModel.Errors = ["Please Configure Application Settings!!"];
      responseModel.IsSuccessful = false;
      return of(responseModel);
    } else {
      url = serviceURL + url;
    }
    if (spinner) {
      this.Request.next(++this.RequestCount);
    }
    return this.http.get<AppResponse>(url).pipe(
      map((response) => {
        if (spinner) {
          this.Request.next(--this.RequestCount);
        }
        return this.mapToAppResponse(response);
      }),
      catchError((error) => {
        if (spinner) {
          this.Request.next(--this.RequestCount);
        }
        responseModel = this.mapToAppResponse(error.error);
        return of(responseModel);
      })
    );
  }

  POST_SEARCH(
    url: string,
    body: any,
    spinner = true
  ): Observable<GetAllAppResponse> {
    let responseModel = new GetAllAppResponse();
    let serviceURL = this.baseURL;
    if (serviceURL == null) {
      responseModel.Errors = ["Please Configure Application Settings!!"];
      responseModel.IsSuccessful = false;
      return of(responseModel);
    } else {
      url = serviceURL + url;
    }
    if (spinner) {
      this.Request.next(++this.RequestCount);
    }

    let headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + this.masterData.SessionKey
    );

    return this.http.post<GetAllAppResponse>(url, body, { headers }).pipe(
      map((response) => {
        if (spinner) {
          this.Request.next(--this.RequestCount);
        }
        return this.mapToGetAllResponse(response);
      }),
      catchError((error) => {
        if (spinner) {
          this.Request.next(--this.RequestCount);
        }
        responseModel = this.mapToGetAllResponse(error.error);
        return of(responseModel);
      })
    );
  }

  UPLOAD_IMAGE(url: string, params: any, spinner = true) {
    let responseModel = new AppResponse();
    let serviceURL = this.baseURL;
    if (serviceURL == null) {
      responseModel.Errors = ["Please Configure Application Settings!!"];
      responseModel.IsSuccessful = false;
      return of(responseModel);
    } else {
      url = serviceURL + url;
    }
    if (spinner) {
      this.Request.next(++this.RequestCount);
    }

    let headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + this.masterData.SessionKey
    );

    return this.http.post<AppResponse>(url, params, { headers }).pipe(
      map((response) => {
        if (spinner) {
          this.Request.next(--this.RequestCount);
        }
        return this.mapToAppResponse(response);
      }),
      catchError((error) => {
        if (spinner) {
          this.Request.next(--this.RequestCount);
        }

        responseModel = this.mapToAppResponse(error.error);
        return of(responseModel);
      })
    );
  }

  private mapToAppResponse(response: any) {
    let result = new AppResponse();
    result.IsSuccessful = response.isSuccessful;
    result.isDBAccessible = response.isDBAccessible;
    result.Errors = response.errors;
    result.Message = response.message ? response.message : "";
    result.Result = response.result;
    return result;
  }

  mapToGetAllResponse(response: any): GetAllAppResponse {
    let result = new GetAllAppResponse();
    result.IsSuccessful = response.isSuccessful;
    result.IsDBAccessible = response.isDBAccessible;
    result.Errors = response.errors;
    result.Result = response.result.recordSet;
    result.Massage = response.message;
    result.TotalPageCount = response.result.totalPageCount
      ? response.result.totalPageCount
      : 0;
    result.TotalRecordCount = response.result.totalRecordCount
      ? response.result.totalRecordCount
      : 0;
    return result;
  }
}

export class AppResponse {
  IsSuccessful = false;
  isDBAccessible = false;
  Message: any;
  Errors: any[] = [];
  Result: any;
}
export class GetAllAppResponse {
  IsDBAccessible = false;
  Errors: any[] = [];
  IsSuccessful = false;
  Massage: String = "";
  Result: any;
  TotalPageCount: number = 0;
  TotalRecordCount: number = 0;
}
