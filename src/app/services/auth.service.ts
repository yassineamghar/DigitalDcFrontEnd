import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

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

}
