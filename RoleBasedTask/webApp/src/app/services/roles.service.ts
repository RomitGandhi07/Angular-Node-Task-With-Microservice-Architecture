import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  // URL & HTTP Options
  private _url: string = 'http://localhost:8088/roles';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };


  constructor(private http: HttpClient) { }

  // This function is responsible for adding the role
  addRole(data): Observable<any> {
    return this.http.post<any>(this._url, data, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  // This function is responsible for getting all the roles
  getRoles(): Observable<any> {
    return this.http.get<any>(this._url)
      .pipe(catchError(this.errorHandler));
  }

  // This function is responsible get array of objects which has role id & name from all the roles
  getRolesName(data) {
    const roles = [];
    data.hits.hits.forEach(role => {
      const name = role._source.name;
      roles.push(name)
    });
    return roles;
  }

  // This function is responsible for updating the name
  updateRole(data,id):Observable<any>{
    return this.http.put<any>(`${this._url}/${id}`,data, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  // This function is responsible for deleting the user
  deleteRole(id,name): Observable<any> {
    return this.http.delete<any>(`${this._url}/${id}?name=${name}`)
      .pipe(catchError(this.errorHandler));
  }

  // This function is responsible for getting info of specific role
  getSpecificRole(id): Observable<any> {
    return this.http.get<any>(`${this._url}/${id}`)
      .pipe(catchError(this.errorHandler));
  }

  //Check a Role if it is Already exist or not
  checkRole(name):Observable<any>{
    return this.http.get<any>(`${this._url}/name/${name}`,this.httpOptions)
     .pipe(catchError(this.errorHandler));
  }

  //Check a Module if it is Already exist or not
  checkModule(name):Observable<any>{
    return this.http.get<any>(`${this._url}/module/${name}`,this.httpOptions)
     .pipe(catchError(this.errorHandler));
  }

  // This function is responsible for searching role based on keyword
  searchKeyword(keyword):Observable<any>{
    return this.http.get<any>(`${this._url}/search?keyword=${keyword}`)
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
