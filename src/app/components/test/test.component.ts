// import { *aslightbox } from 'lightbox2';
import { Component,AfterViewInit, ElementRef, OnInit, ViewChild } from '@angular/core';
import 'slick-carousel';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { NotificationService } from 'src/app/services/Notification/notification.service';
import { ECE } from 'src/app/models/Media/ECE';
import { EceService } from 'src/app/services/ECE/ece.service';
import { TestService } from 'src/app/services/Test/test.service';
import { MessageService } from 'primeng/api';
declare var $: any;
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  providers: [MessageService],
})
export class TestComponent implements OnInit {
  
  visible: boolean = false;

  showDialog() {
      this.visible = true;
  }

  showUpdateForm: boolean = false;
  selectedFile: File | null = null;
  selectedECE: ECE | any;
  ece: ECE[] = [];
  newEce: { title: string, description: string } = { title: '', description: '' };

 selectECE(item: ECE): void {
    this.selectedECE = item;
  }
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private testService: TestService,
    private eceService: EceService,
    private notificationService: NotificationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadECE();
  }

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
        this.selectedFile = event.target.files[0];
        const fileName = event.target.files[0].name;
        // Type assertion to HTMLLabelElement or null
        const fileLabel = document.getElementById('file-label') as HTMLLabelElement | null;
        if (fileLabel) {
            fileLabel.innerHTML = fileName;
        }
    }
  }

  loadECE(): void {
    this.eceService.getAllECE().subscribe(
      (data) => {
        this.ece = data;
        // this.notificationService.showSuccess('ECE loaded successfully.');
        console.log('ECE:', this.ece);
      },
      (error) => {
        console.error('Error loading ECE:', error);
        this.notificationService.showError('Failed to load ECE. Please try again later.');
      }
    );
  }

  uploadECE(): void {
    if (this.selectedFile !== null && this.selectedFile !== undefined) {
      console.log('Uploading file:', this.selectedFile);
      const formData: FormData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('Title', this.newEce.title);
      formData.append('Description', this.newEce.description);
      this.testService.uploadECE(formData).subscribe(
        (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            const percentDone = event.total ? Math.round(100 * event.loaded / event.total) : 0;
            console.log(`File is ${percentDone}% uploaded.`);
            this.messageService.add({ severity: 'info', summary: 'Uploading!!', detail: `File is ${percentDone}% uploaded.`});
            this.loadECE();
          } else if (event instanceof HttpResponse) {
            console.log('File is completely uploaded!', event.body);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File uploaded successfully!' });
            this.loadECE();
            this.visible = false;
            this.resetForm();
          }
        },
        (error) => {
          console.error('Error uploading file:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to upload file.' });
        }
      );
    } else {
      console.error('No file selected.');
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'No file selected.' });
    }
  }

  resetForm() {
    this.newEce = { title: '', description: '' };
    this.selectedFile = null;
    // Reset the file input element
    const fileInput = document.getElementById('file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  updateECE(): void {
    if (this.selectedECE && this.selectedFile !== null) {
      // Assuming testService.updateECE() returns Observable, adjust as per your service implementation
      this.testService.updateECE(this.selectedECE.id_ECE, this.selectedFile).subscribe(
        (event) => {
          if (event.type === HttpEventType.Response) {
            console.log('ECE updated successfully:', event.body);
            this.loadECE(); // Reload ECE items after update
            this.selectedFile = null; // Reset selectedFile after update
            this.selectedECE = null; // Deselect ECE item after update
          }
        },
        (error) => {
          console.error('Error updating ECE:', error);
        }
      );
    } else {
      console.error('No ECE selected or no file provided.');
    }
  }

  deleteECE(): void {
    if (this.selectedECE) {
      // Assuming testService.deleteECE() returns Observable, adjust as per your service implementation
      this.testService.deleteECE(this.selectedECE.id_ECE).subscribe(
        () => {
          console.log('ECE deleted successfully');
          this.loadECE(); // Reload ECE items after deletion
          this.selectedECE = null; // Deselect ECE item after deletion
        },
        (error) => {
          console.error('Error deleting ECE:', error);
        }
      );
    } else {
      console.error('No ECE selected.');
    }
  }
}