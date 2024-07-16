import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ECE } from 'src/app/models/Media/ECE';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EceService {
  private apiUrl = `${environment.apiUrl}/ECE`;
  private currentUserToken: string | null = null;
  token = localStorage.getItem('token');

  constructor(private http: HttpClient) { }

  private getHttpOptions(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    console.log(token);
    return {
      headers: new HttpHeaders({
        'Authorization': token ? `Bearer ${token}` : ''
      })
    };
  }

  getAllECE(): Observable<ECE[]> {
    return this.http.get<ECE[]>(`${this.apiUrl}/AllECE`);
  }

  uploadECE(formData: FormData): Observable<HttpEvent<any>> {
    formData.forEach((value, key) => {
      console.log(key, value);
    });
    const httpOptions = this.getHttpOptions();
    console.log('http', httpOptions.headers);
    return this.http.post<any>(`${this.apiUrl}/upload`, formData, {
      headers: httpOptions.headers,
      reportProgress: true,
      observe: 'events'
    });
  }

  getUserRoles(): string[] {
    const token = localStorage.getItem('token');
    if (!token) {
      return [];
    }
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

  private decodeBase64(input: string): any {
    const base64Url = input.replace(/-/g, '+').replace(/_/g, '/');
    const base64 = decodeURIComponent(atob(base64Url).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(base64);
  }

  updateECE(id: string, formData: FormData): Observable<any> {
    const httpOptions = this.getHttpOptions();
    return this.http.put(`${this.apiUrl}/updateECE/${id}`, formData, {
      headers: httpOptions.headers,
      reportProgress: true,
      observe: 'events',
      responseType: 'text' as 'json'
    });
  }


  deleteECE(id: string): Observable<any> {
    const httpOptions = this.getHttpOptions();
    return this.http.delete<any>(`${this.apiUrl}/deleteECE/${id}`, {
      headers: httpOptions.headers,
      responseType: 'text' as 'json'
    });
  }
}