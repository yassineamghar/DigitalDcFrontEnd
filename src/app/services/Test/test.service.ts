import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private apiUrl = `${environment.apiUrl}/ECE`;

  constructor(private http: HttpClient) { }
  
  
  uploadECE(formData: FormData): Observable<HttpEvent<any>> {
    const req = new HttpRequest('POST', `${this.apiUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  updateECE(id: string, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('newFile', file, file.name);
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
