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
  private currentUserToken: string | null = null;
  token = localStorage.getItem('token');
  constructor(private httpClient: HttpClient) {}

  private getHttpOptions(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    console.log (token);
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      })
    };
  }
  
      
  register(registerForm: any, role: string): Observable<any> {
    const url = `${this.apiUrl}/register?role=${role}`;
    return this.httpClient.post(url, registerForm);
  }

  login(loginForm: any): Observable<any> {
    const url = `${this.apiUrl}/login`
    const httpOptions = this.getHttpOptions();
    return this.httpClient.post(url, loginForm,httpOptions);
  }

  resetPassword(data: any): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/reset-password`, data).pipe(
      catchError(this.handleError<any>('resetPassword'))
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/forgot-password?Email=${email}`, {}).pipe(
      catchError(this.handleError<any>('forgotPassword'))
    );
  }
  GetAll(): Observable<any> {
    const url = `${this.apiUrl}/AllUsers`;
    const httpOptions = this.getHttpOptions();
    return this.httpClient.get(url, httpOptions);
  }

  updateUser(userId: string, user: any): Observable<any> {
    const url = `${this.apiUrl}/UpdateUser/${userId}`;
    const httpOptions = this.getHttpOptions();
    return this.httpClient.put(url, user, httpOptions).pipe(
      catchError(this.handleError<any>('updateUser'))
    );
  }

  deleteUser(userId: string): Observable<any> {
    const url = `${this.apiUrl}/DeleteUser/${userId}`;
    const httpOptions = this.getHttpOptions();
    return this.httpClient.delete(url,httpOptions).pipe(
      catchError(this.handleError<any>('deleteUser'))
    );
  }

  setToken(token: string): void {
    this.currentUserToken = token;
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    if (!this.currentUserToken) {
      this.currentUserToken = localStorage.getItem('token');
    }
    return this.currentUserToken;
  }

  logout(): void {
    this.currentUserToken = null;
    localStorage.removeItem('token');
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}