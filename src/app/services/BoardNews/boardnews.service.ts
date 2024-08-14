import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BoardNews } from 'src/app/models/BoardNews/BoardNews';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BoardnewsService {
  private apiUrl = `${environment.apiUrl}/BoardNews`;
  private currentUserToken: string | null = null;
  token = localStorage.getItem('token');

  constructor(private http: HttpClient) {}

  private getHttpOptions(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    console.log(token);
    return {
      headers: new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : '',
      }),
    };
  }

  uploadBN(formData: FormData): Observable<HttpEvent<any>> {
    formData.forEach((value, key) => {
      console.log(key, value);
    });
    const httpOptions = this.getHttpOptions();
    console.log('http', httpOptions.headers);
    return this.http.post<any>(`${this.apiUrl}/upload`, formData, {
      headers: httpOptions.headers,
      reportProgress: true,
      observe: 'events',
    });
  }

  updateBN(id: string, formData: FormData): Observable<any> {
    const httpOptions = this.getHttpOptions();
    console.log(id);
    return this.http.put(`${this.apiUrl}/updateBN/${id}`, formData, {
      headers: httpOptions.headers,
      reportProgress: true,
      observe: 'events',
      responseType: 'text' as 'json',
    });
  }

  deleteBN(id: string): Observable<any> {
    const httpOptions = this.getHttpOptions();
    return this.http.delete<any>(`${this.apiUrl}/deleteBN/${id}`, {
      headers: httpOptions.headers,
      responseType: 'text' as 'json',
    });
  }

  getAllBN(): Observable<BoardNews[]> {
    return this.http.get<BoardNews[]>(`${this.apiUrl}/combined`);
  }

  getWorkload(): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/Workload/getWorkload`, { responseType: 'blob' });
  }
  
}
