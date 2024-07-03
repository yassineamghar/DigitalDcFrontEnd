import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { workshop } from 'src/app/models/Workshop/workshop';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {
  private apiUrl = `${environment.apiUrl}/Workshop`;
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

  getAllWorkshop(): Observable<workshop[]> {
    return this.http.get<workshop[]>(`${this.apiUrl}/AllWorkshop`);
  }

  uploadWS(formData: FormData): Observable<HttpEvent<any>> {
    // Logging the FormData entries
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

  // Helper function to decode base64 encoded string
  private decodeBase64(input: string): any {
    const base64Url = input.replace(/-/g, '+').replace(/_/g, '/');
    const base64 = decodeURIComponent(atob(base64Url).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(base64);
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

  updateWS(id: string, formData: FormData): Observable<any> {
    const httpOptions = this.getHttpOptions();
    return this.http.put(`${this.apiUrl}/updateWS/${id}`, formData, {
      headers: httpOptions.headers,
      reportProgress: true,
      observe: 'events',
      responseType: 'text' as 'json' // Trick TypeScript to accept 'text' for event observation
    });
  }

  deleteWS(id: string): Observable<any> {
    const httpOptions = this.getHttpOptions();
    return this.http.delete<any>(`${this.apiUrl}/deleteWS/${id}`, {
      headers: httpOptions.headers,
      responseType: 'text' as 'json'
    });
  }

}
