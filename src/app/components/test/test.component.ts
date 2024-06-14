import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  providers: [MessageService] 
})
export class TestComponent implements OnInit {
  
  visible: boolean = false;

  showDialog() {
      this.visible = true;
  }

  selectedFile: File | null = null;
  selectedECE: ECE | null = null;
  ece: ECE[] = [];
  newEce: { title: string, description: string } = { title: '', description: '' };


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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
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

  uploadFile(): void {
    if (this.selectedFile !== null && this.selectedFile !== undefined) {
      // console.log('Uploading file:', this.selectedFile);
      const formData: FormData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('Title', this.newEce.title);
      formData.append('Description', this.newEce.description);
      this.testService.uploadECE(formData).subscribe(
        (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            const percentDone = event.total ? Math.round(100 * event.loaded / event.total) : 0;
            console.log(`File is ${percentDone}% uploaded.`);
            this.messageService.add({ severity: 'wait', summary: 'Uploading!!', detail: `File is ${percentDone}% uploaded.`});

          } else if (event instanceof HttpResponse) {
            console.log('File is completely uploaded!', event.body);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File uploaded successfully!' });
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



  // selectECE(ece: ECE): void {
  //   this.selectedECE = ece;
  // }

  // updateECE(): void {
  //   if (!this.selectedECE || !this.selectedFile) {
  //     console.error('No ECE selected or no file provided.');
  //     return;
  //   }

  //   this.eceService.updateECE(this.selectedECE.id_ECE, this.selectedFile).subscribe(
  //     () => {
  //       console.log('ECE updated successfully.');
  //       this.loadECE();
  //     },
  //     (error) => {
  //       console.error('Error updating ECE:', error);
  //     }
  //   );
  // }

  // deleteECE(): void {
  //   if (!this.selectedECE) {
  //     console.error('No ECE selected.');
  //     return;
  //   }

  //   this.eceService.deleteECE(this.selectedECE.id_ECE).subscribe(
  //     () => {
  //       console.log('ECE deleted successfully.');
  //       this.loadECE();
  //       this.selectedECE = null;
  //     },
  //     (error) => {
  //       console.error('Error deleting ECE:', error);
  //     }
  //   );
  // }

  // addECE(): void {
  //   if (!this.selectedFile) {
  //     console.error('No file selected for upload.');
  //     return;
  //   }

  //   this.eceService.uploadECE(this.selectedFile).subscribe(
  //     (response) => {
  //       console.log('File uploaded successfully.');
  //       this.loadECE();
  //       this.notificationService.showSuccess('ECE added successfully.');
  //     },
  //     (error) => {
  //       console.error('Error uploading file:', error);
  //       this.notificationService.showError('Failed to upload ECE.');
  //     }
  //   );
  // }

  // triggerFileInput(): void {
  //   this.fileInput.nativeElement.click();
  // }
}