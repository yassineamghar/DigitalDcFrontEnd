import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/Account`;

  constructor(private http: HttpClient) {}

  register(registerForm: any, role: string): Observable<any> {
    const url = `${this.apiUrl}/register?role=${role}`;
    return this.http.post(url, registerForm);
  }
  
  login(loginForm: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, loginForm);
  }

  resetPassword(data:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`,data);
  }
 
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password?Email=${email}`, {  });
  }

  updateUser(userId: string, user: User): Observable<any> {
    const url = `${this.apiUrl}/UpdateUser/${userId}`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.put(url, user, httpOptions)
      .pipe(
        catchError(this.handleError<any>('updateUser'))
      );
  }

  GetAll(): Observable<any> {
    const url = `${this.apiUrl}/AllUsers`;
    return this.http.get(url)
      .pipe(
        catchError(this.handleError<any>('GetAll', []))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
