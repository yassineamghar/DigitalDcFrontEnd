import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(registerForm: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, registerForm);
  }
  
  login(loginForm: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, loginForm);
  }

  forgotPassword(forgotpassform: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, forgotpassform);
  }



}
