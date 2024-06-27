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


  // private apiUrl = 'http://localhost:5037/api/ECE';
  // private token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoidXNlcnRlc3QiLCJqdGkiOiIwYmRjM2EzYS1lOWE2LTRiNjEtOGQwMy0wOWRkNTVjYzEwOTMiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJVc2VyIiwiZXhwIjoxNzE5NTI5NjY4LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUxNDQiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjQyMDAifQ.RE4PyQqCh_R6a-CmDe4C8r0HjVmPe-bMrLtxgLrUAcQ';

  constructor(private http: HttpClient) { }

  private getHttpOptions(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    console.log(token);
    return {
      headers: new HttpHeaders({
        // 'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      })
    };
  }

  getAllECE(): Observable<ECE[]> {
    return this.http.get<ECE[]>(`${this.apiUrl}/AllECE`);
  }

  // Function to upload ECE
  uploadECE(formData: FormData): Observable<HttpEvent<any>> {
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


  // uploadECE(formData: FormData): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoidXNlcnRlc3QiLCJqdGkiOiIwYmRjM2EzYS1lOWE2LTRiNjEtOGQwMy0wOWRkNTVjYzEwOTMiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJVc2VyIiwiZXhwIjoxNzE5NTI5NjY4LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUxNDQiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjQyMDAifQ.RE4PyQqCh_R6a-CmDe4C8r0HjVmPe-bMrLtxgLrUAcQ'
  //   });

  //   return this.http.post(`${this.apiUrl}/upload`, formData, { headers }).pipe(
  //     catchError(error => {
  //       console.error('Upload error', error);
  //       return throwError(error);
  //     })
  //   );  }


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
    const httpOptions = this.getHttpOptions();
    return this.http.put(`${this.apiUrl}/updateECE/${id}`, formData, {
      headers: httpOptions.headers,
      reportProgress: true,
      observe: 'events',
      responseType: 'text' as 'json' // Trick TypeScript to accept 'text' for event observation
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