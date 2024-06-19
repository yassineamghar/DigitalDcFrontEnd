import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class TestService {
  private apiUrl = `${environment.apiUrl}/ECE`;
  private currentUserToken: string | null = null;
  token = localStorage.getItem('token');

  constructor(private http: HttpClient) { }
  
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

  uploadECE(formData: FormData): Observable<HttpEvent<any>> {
    const httpOptions = this.getHttpOptions();
    const req = new HttpRequest('POST', `${this.apiUrl}/upload`, formData, {
      headers: httpOptions.headers, // Ensure headers are passed correctly
      reportProgress: true,
      responseType: 'json'
    });
  
    return this.http.request(req);
  }
  

  getUserRoles(): string[] {
    const token = localStorage.getItem('token');
    if (!token) {
      return [];
    }

    // Split the token by '.' to get the payload section
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.error('Invalid token format');
      return [];
    }

    // Decode the payload (second part)
    const payload = this.decodeBase64(tokenParts[1]);
    console.log('Decoded Token:', payload);

    // Extract roles from payload
    const roles = payload?.roles || [];

    return roles;
  }

  // Helper function to decode base64 encoded string
  private decodeBase64(input: string): any {
    const base64Url = input.replace(/-/g, '+').replace(/_/g, '/');
    const base64 = decodeURIComponent(atob(base64Url).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(base64);
  }

  updateECE(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateECE/${id}`, formData, {
      reportProgress: true,
      observe: 'events',
      responseType: 'text' as 'json' // Trick TypeScript to accept 'text' for event observation
    });
  }


  deleteECE(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/deleteECE/${id}`, { responseType: 'text' as 'json' });
  }
}

