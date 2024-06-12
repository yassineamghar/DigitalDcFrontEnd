import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ECE } from 'src/app/models/Media/ECE';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EceService {
  private apiUrl = `${environment.apiUrl}/ECE`;

  constructor(private http: HttpClient) { }

  getAllECE(): Observable<ECE[]> {
    return this.http.get<ECE[]>(`${this.apiUrl}/AllECE`);
  }


  uploadECE(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(`${this.apiUrl}/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  getECEById(Id: string): Observable<Blob> {
    const url = `${this.apiUrl}/${Id}`;
    return this.http.get(url, { responseType: 'blob' });
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
