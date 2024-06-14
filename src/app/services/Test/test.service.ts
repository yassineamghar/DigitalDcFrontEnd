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
}
