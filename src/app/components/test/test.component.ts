import { ArticleService } from 'src/app/services/Articles/article.service';
import { Component, OnInit } from '@angular/core';
import 'slick-carousel';
import { Articles } from 'src/app/models/Media/Articles';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import * as pdfjsLib from 'pdfjs-dist';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  articles: Articles[] = [];
  selectedArticle: Articles | undefined;
  selectedFile: File | null = null;
  showUpdateForm: boolean = false;
  firstPageImage: string | null = null;
  articlePreviews: string[] = [];
  constructor(private articleService: ArticleService) { }

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.articleService.getArticles().subscribe(
      (data) => {
        this.articles = data;
      },
      (error) => {
        console.error('Error loading articles:', error);
      }
    );
  }

  selectArticle(article: Articles): void {
    this.selectedArticle = { ...article };
  }

  updateArticle(): void {
    if (this.selectedArticle && this.selectedFile !== null) {
      this.articleService.updateArticle(this.selectedArticle.id_ART, this.selectedFile).subscribe(
        (response) => {
          console.log('Article updated successfully:', response);
          this.loadArticles(); // Reload articles after update
          this.showUpdateForm = false; // Hide the update form after update
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
          console.log('Article deleted successfully:', response);
          this.loadArticles(); // Reload articles after deletion
          this.selectedArticle = undefined; // Deselect article after deletion
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
            // If an article is selected, update it with the uploaded file
            if (this.selectedArticle) {
              this.updateArticle();
            } else {
              console.error('No article selected.');
            }
            this.loadArticles(); // Reload articles after upload
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

  async extractArticlePreviews(): Promise<void> {
    for (const article of this.articles) {
      try {
        const response = await fetch(article.pdf_URL);
        const arrayBuffer = await response.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        const firstPage = await pdf.getPage(1); // Pages are 1-indexed
        const viewport = firstPage.getViewport({ scale: 1 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const renderContext = {
          canvasContext: context!,
          viewport: viewport
        };
        await firstPage.render(renderContext).promise;
        this.articlePreviews.push(canvas.toDataURL('image/png'));
      } catch (error) {
        console.error('Error extracting preview for article:', article.pdf_Name, error);
        this.articlePreviews.push('');
      }
    }
  }
  
  
}