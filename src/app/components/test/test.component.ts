import { ArticleService } from 'src/app/services/Articles/article.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import 'slick-carousel';
import { Articles } from 'src/app/models/Media/Articles';
import { HttpErrorResponse,HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NotificationService } from 'src/app/services/Notification/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/Materials/dialog/dialog.component';
import { PdfService } from 'src/app/services/PDF/pdf.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  articleUrl: string = 'https://example.com/article';
  thumbnails: string[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // this.fetchArticleContent();
  }

  // fetchArticleContent() {
  //   this.http.get<any>(this.articleUrl, { responseType: 'text' }).subscribe(
  //     (response) => {
  //       const parser = new DOMParser();
  //       const htmlDoc = parser.parseFromString(response, 'text/html');
  //       const thumbnailElements = htmlDoc.querySelectorAll('.thumbnail'); // adjust selector as per your HTML structure
  //       this.thumbnails = Array.from(thumbnailElements).map((element: any) => element.src);
  //     },
  //     (error) => {
  //       console.error('Error fetching article content:', error);
  //     }
  //   );
  // }
}