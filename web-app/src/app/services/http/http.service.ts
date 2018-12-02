import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  baseUrl = "/";
  constructor(private http: HttpClient) { }

  tripBook(data, token): Observable<any> {
    return this.http.post(this.baseUrl + 'cab/book', data)
      .pipe(catchError(error => of(error)));
  }

  tripCancel(id): Observable<any> {
    return this.http.post(this.baseUrl + 'cab/cancel', { id: id })
      .pipe(catchError(error => of(error)));
  }

  postReport(data): Observable<any> {
    return this.http.post(this.baseUrl + 'cab/report', data)
      .pipe(catchError(error => of(error)));
  }

  getTrip(id): Observable<any> {
    return this.http.get(this.baseUrl + 'cab/trips?id=' + id)
      .pipe(catchError(error => of(error)));
  }

  createUser(data): Observable<any> {
    return this.http.post(this.baseUrl + 'cab/user', data)
      .pipe(catchError(error => of(error)));
  }

  createDriver(data): Observable<any> {
    return this.http.get(this.baseUrl + 'cab/drive', data)
      .pipe(catchError(error => of(error)));
  }

  checkAvailability(data): Observable<any> {
    return this.http.post(this.baseUrl + 'cab/availability', data)
      .pipe(catchError(error => of(error)));
  }

}
