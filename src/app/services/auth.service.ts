import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/Account`;
  private currentUserToken: string | null = null;
  token = localStorage.getItem('token');
  
  private isAuthenticatedSubject = new BehaviorSubject  <boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();



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
  
  getUserRoles(): string[] {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return [];
    }

    // Split the token by '.' to get the payload section
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.error('Invalid token format');
      return [];
    }

    // Decode the payload (second part)
    const payload = JSON.parse(atob(tokenParts[1]));

    // Extract roles from payload
    const roles = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    console.log('User Roles:', roles);

    return roles ? [roles] : [];
  }
      
  register(registerForm: any, role: string): Observable<any> {
    const url = `${this.apiUrl}/register?role=${role}`;
    return this.httpClient.post(url, registerForm);
  }

  login(loginForm: any): Observable<any> {
    const url = `${this.apiUrl}/login`
    this.isAuthenticatedSubject.next(true);
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
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated() {
    return this.isAuthenticatedSubject.value;
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

function jwt_decode(token: string): any {
  throw new Error('Function not implemented.');
}
