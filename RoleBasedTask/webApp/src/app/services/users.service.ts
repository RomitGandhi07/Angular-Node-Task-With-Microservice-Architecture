import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable,throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import { EMPTY } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http:HttpClient) { }

  // URL & HTTP Options
  private _url:string='http://localhost:8089/users';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  // This function is responsible for adding the role
  addUser(data):Observable<any>{
    return this.http.post<any>(this._url,data, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  updateUser(data,id):Observable<any>{
    return this.http.put<any>(`${this._url}/${id}`,data, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  // This function is responsible for getting all the users
  getUsers():Observable<any>{
    return this.http.get<any>(this._url)
      .pipe(catchError(this.errorHandler));
  }

  // This function is responsible for deleting the user
  deleteUser(id):Observable<any>{
    return this.http.delete<any>(`${this._url}/${id}`)
      .pipe(catchError(this.errorHandler));
  }

  // This function is responsible for getting info of specific user
  getSpecificUsers(id):Observable<any>{
    return this.http.get<any>(`${this._url}/${id}`)
      .pipe(catchError(this.errorHandler));
  }

  validateUser(e,p):Observable<any>{
    const data={email:e.value,password:p.value}
    return this.http.post<any>(`${this._url}/validate`,data,this.httpOptions)
     .pipe(catchError(this.errorHandler));
  }

  checkUser(email):Observable<any>{
    const data={email:email}
    return this.http.post<any>(`${this._url}/checkUser`,data,this.httpOptions)
     .pipe(catchError(this.errorHandler));
  }

  // This function is responsible for getting info of specific user
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
