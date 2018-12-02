import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  tripBook(data, token): Observable<any> {
    return this.http.post('http://localhost:3000/cab/book', data)
      .pipe(catchError(error => of(error)));
  }

  tripCancel(id): Observable<any> {
    return this.http.post('http://localhost:3000/cab/cancel', { id: id })
      .pipe(catchError(error => of(error)));
  }

  postReport(data): Observable<any> {
    return this.http.post('http://localhost:3000/cab/report', data)
      .pipe(catchError(error => of(error)));
  }

  getTrip(id): Observable<any> {
    return this.http.get('http://localhost:3000/cab/trips?id=' + id)
      .pipe(catchError(error => of(error)));
  }

  createUser(data): Observable<any> {
    return this.http.post('http://localhost:3000/cab/user', data)
      .pipe(catchError(error => of(error)));
  }

  createDriver(data): Observable<any> {
    return this.http.get('http://localhost:3000/cab/drive', data)
      .pipe(catchError(error => of(error)));
  }

  checkAvailability(data): Observable<any> {
    return this.http.post('http://localhost:3000/cab/availability', data)
      .pipe(catchError(error => of(error)));
  }

}
