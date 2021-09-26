import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable,throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class NamesService {

  constructor(private http:HttpClient) { }
  private _url:string='http://localhost:8090/names';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  getNames(moduleName,keyword):Observable<any>{
    return this.http.get<any>(`${this._url}?module=${moduleName}&keyword=${keyword}`)
      .pipe(catchError(this.errorHandler));
  }

   // This is error handler function
  errorHandler(errorResponse:HttpErrorResponse){
    if(errorResponse.error instanceof ErrorEvent){
      console.log('Clinet side error...',errorResponse.error.message);
    }
    else{
      console.log('server side error...',errorResponse);
    }
    return throwError("Something Went Wrong...");
  }
}
