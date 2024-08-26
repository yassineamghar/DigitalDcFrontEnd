import { Articles } from './../../models/Media/Articles';
// import { ArticleResponse } from 'src/app/models/Media/ArticleResponse';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';   // Adjust the import path as needed
import { PDFDocument, PDFPage } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = `${environment.apiUrl}/Article`;

  constructor(private http: HttpClient) { }

  getArticles(): Observable<Articles[]> {
    return this.http.get<Articles[]>(`${this.apiUrl}/AllArticles`);
  }
    
  getArticleFile(articleId: string): Observable<Blob> {
    const url = `${this.apiUrl}/${articleId}`;
    return this.http.get(url, { responseType: 'blob' });
  }
  
  downloadArticleFile(articleId: string): Observable<Blob> {
    const url = `${this.apiUrl}/${articleId}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  uploadFile(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(`${this.apiUrl}/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
  
  updateArticle(id: string, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('newFile', file, file.name);
    return this.http.put(`${this.apiUrl}/updateArticle/${id}`, formData, {
      reportProgress: true,
      observe: 'events',
      responseType: 'text' as 'json' // Trick TypeScript to accept 'text' for event observation
    });
  }
  
  deleteArticle(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/deleteArticle/${id}`, { responseType: 'text' as 'json' });
  }

  extractPreviews(id: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/extractPreviews/${id}`);
  }

  
}