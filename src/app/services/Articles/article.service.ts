import { Articles } from './../../models/Media/Articles';
// import { ArticleResponse } from 'src/app/models/Media/ArticleResponse';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    

  getArticleById(id: string): Observable<Articles> {
    return this.http.get<Articles>(`${this.apiUrl}/${id}`);
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
      observe: 'events'
    });
  }
  
  

  deleteArticle(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteArticle/${id}`);
  }
  

  //extract the first page from a PDF file
  async extractFirstPage(file: File): Promise<string | null> {
    try {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      const arrayBuffer = await new Promise<ArrayBuffer>((resolve) => {
        reader.onload = () => {
          resolve(reader.result as ArrayBuffer);
        };
      });
  
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      const page = await pdf.getPage(1); // Pages are 1-indexed
  
      const viewport = page.getViewport({ scale: 1 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
  
      const renderContext = {
        canvasContext: context!,
        viewport: viewport
      };
  
      await page.render(renderContext).promise;
  
      // Convert canvas to PNG image data URL
      const imageData = canvas.toDataURL('image/png');
  
      return imageData;
    } catch (error) {
      console.error('Error extracting first page:', error);
      return null;
    }
  }
}