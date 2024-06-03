import { ArticleService } from 'src/app/services/Articles/article.service';
import { Component, OnInit } from '@angular/core';
import 'slick-carousel';
import { Articles } from 'src/app/models/Media/Articles';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import * as pdfjsLib from 'pdfjs-dist';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NotificationService } from 'src/app/services/Notification/notification.service';
import { environment } from 'src/environments/environment';
import { DialogComponent } from 'src/app/Materials/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  articles: Articles[] = [];
  selectedArticle: Articles | any;
  selectedFile: File | null = null;
  showUpdateForm: boolean = false;
  firstPageImage: string | null = null;
  articlePreviews: string[] = [];
  showPopup: boolean = false;
  selectedArticleUrl: SafeResourceUrl = '';
  private apiUrl = `${environment.apiUrl}`;
  articleId: string = '';
  file: File | null = null;
  

  constructor(private articleService: ArticleService,public dialog: MatDialog, private sanitizer: DomSanitizer, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.loadArticles();
    console.log(this.articles);
  }

  loadArticles(): void {
    this.articleService.getArticles().subscribe(
      (data) => {
        this.articles = data;
        this.notificationService.showSuccess('Articles loaded successfully.');
      },
      (error) => {
        console.error('Error loading articles:', error);
        this.notificationService.showError('Failed to load articles. Please try again later.');
      }
    );
  }


  // downloadArticleFile(): void {
  //   if (!this.articleId) {
  //     console.error('Article ID is required');
  //     return;
  //   }
  //   this.articleService.getArticleFile(this.articleId).subscribe(blob => {
  //     const url = URL.createObjectURL(blob);
  //     window.open(url, '_blank');
  //   }, error => {
  //     console.error('Error fetching article file:', error);
  //   });
  // }
  

  selectArticle(article: Articles): void {
    this.selectedArticle = { ...article };
  }
  closePopup() {
    this.showPopup = false;
    this.selectedArticleUrl = '';
  }

  updateArticle(): void {
    if (this.selectedArticle && this.selectedFile !== null) {
      this.articleService.updateArticle(this.selectedArticle.id_ART, this.selectedFile).subscribe(
        (event) => {
          if (event.type === HttpEventType.Response) {
            console.log('Article updated successfully:', event.body);
            this.loadArticles(); // Reload articles after update
            this.showUpdateForm = false; // Hide the update form after update
          }
        },
        (error) => {
          console.error('Error updating article:', error);
        }
      );
    } else {
      console.error('No article selected or no file provided.');
    }
  }
  

  deleteSelectedArticle(): void {
    if (this.selectedArticle) {
        this.articleService.deleteArticle(this.selectedArticle.id_ART).subscribe(
            (response) => {
                console.log('Article deleted successfully');
                this.loadArticles(); // Reload articles after deletion
                this.showUpdateForm = false; // Hide the update form after deletion
            },
            (error) => {
                console.error('Error deleting article:', error);
            }
        );
    } else {
        console.error('No article selected.');
    }
}


  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadFile(): void {
    if (this.selectedFile !== null && this.selectedFile !== undefined) {
      this.articleService.uploadFile(this.selectedFile).subscribe(
        (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round(100 * event.loaded / event.total);
            console.log(`File is ${percentDone}% uploaded.`);
          } else if (event instanceof HttpResponse) {
            console.log('File is completely uploaded!', event.body);
            this.loadArticles();
          }
        },
        (error) => {
          console.error('Error uploading file:', error);
        }
      );
    } else {
      console.error('No file selected.');
    }
  }

  toggleUpdateForm(): void {
    this.showUpdateForm = !this.showUpdateForm;
  }

  extractArticlePreviews(): void {
    if (this.selectedArticle) {
      this.articleService.extractPreviews(this.selectedArticle.id_ART).subscribe(
        (previews) => {
          this.articlePreviews = previews;
        },
        (error) => {
          console.error('Error extracting previews:', error);
        }
      );
    } else {
      console.error('No article selected.');
    }
  }

  downloadArticleFile(articleId: string): void {
    this.articleService.downloadArticleFile(articleId).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }, error => {
      console.error('Error fetching article file:', error);
      // Handle error
    });
  }
  viewArticle(articleId: string): void {
    this.articleService.downloadArticleFile(articleId).subscribe(blob => {
      const url = URL.createObjectURL(blob);

      const dialogRef = this.dialog.open(DialogComponent, {
        width: '800px',
        data: { title: this.selectedArticle.pdf_Name, url: url }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }, error => {
      console.error('Error fetching article file:', error);
    });
  }

  // viewArticle(articleId: string): void {
  //   this.articleService.downloadArticleFile(articleId).subscribe(blob => {
  //     const url = URL.createObjectURL(blob);
  //     const newWindow = window.open(url, '_blank');
  //     if (newWindow) {
  //       newWindow.focus();
  //     } else {
  //       console.error('Popup blocked by browser');
  //       // Handle popup block error
  //     }
  //   }, error => {
  //     console.error('Error fetching article file:', error);
  //     // Handle error
  //   });
  // }

  // async extractArticlePreviews(): Promise<void> {
  //   for (const article of this.articles) {
  //     try {
  //       const response = await fetch(article.pdf_URL);
  //       const arrayBuffer = await response.arrayBuffer();
  //       const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  //       const firstPage = await pdf.getPage(1); // Pages are 1-indexed
  //       const viewport = firstPage.getViewport({ scale: 1 });
  //       const canvas = document.createElement('canvas');
  //       const context = canvas.getContext('2d');
  //       canvas.width = viewport.width;
  //       canvas.height = viewport.height;
  //       const renderContext = {
  //         canvasContext: context!,
  //         viewport: viewport
  //       };
  //       await firstPage.render(renderContext).promise;
  //       this.articlePreviews.push(canvas.toDataURL('image/png'));
  //     } catch (error) {
  //       console.error('Error extracting preview for article:', article.pdf_Name, error);
  //       this.articlePreviews.push('');
  //     }
  //   }
  // }
  
  
}