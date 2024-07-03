import { HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { workshop } from 'src/app/models/Workshop/workshop';
import { NotificationService } from 'src/app/services/Notification/notification.service';
import { WorkshopService } from 'src/app/services/Workshop/workshop.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-workshop',
  templateUrl: './workshop.component.html',
  styleUrls: ['./workshop.component.css']
})
export class WorkshopComponent implements OnInit{
  
  visible: boolean = false;
  showUpdateForm: boolean = false;
  selectedImageFile: File | null = null;
  selectedPdfFile: File | null = null;
  selectedWS: workshop | any;
  ws: workshop[] = [];
  newWS: { title: string, description: string } = { title: '', description: '' };
  fileName: string = '';
  imageToShow: string | null = null;
  isImageDialogVisible = false;
  searchTerm: string = '';
  isAuthorized: boolean = false;
  addDialogVisible: boolean = false;
  updateDialogVisible: boolean = false;
  deleteDialogVisible: boolean = false;
  itemToDelete: any;


  constructor(
    private wsService: WorkshopService,
    private notificationService: NotificationService,
    private messageService: MessageService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) { }

  @ViewChild('fileInput') fileInput!: ElementRef;

  ngOnInit(): void {
    this.loadWS();
    this.isAuthorized = this.checkUserAuthorization();
    // Force change detection after updating isAuthorized
    this.cdr.detectChanges();
  }

  checkUserAuthorization(): boolean {
    const userRoles = this.authService.getUserRoles();
    const isAdminOrUser = userRoles.includes('Admin') || userRoles.includes('User');
    this.loadWS();
    return isAdminOrUser;

  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  showAddDialog() {
    this.resetForm();
    this.addDialogVisible = true;
  }

  showUpdateDialog(item: any): void {
    this.newWS = { ...item };
    this.updateDialogVisible = true;
  }

  showDeleteDialog(item: any): void {
    this.itemToDelete = item;
    this.deleteDialogVisible = true;
  }

  selectECE(item: workshop): void {
    this.selectedWS = item;
    this.newWS = { ...item }; 
    this.fileName = item.image_Name || '';
  }

  onFileSelectedImage(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedImageFile = event.target.files[0];
      const fileName = event.target.files[0].name;
      const fileLabel = document.getElementById('file-label-Image') as HTMLLabelElement | null;
      if (fileLabel) {
        fileLabel.innerHTML = fileName;
      }
    }
  }

  onFileSelectedPdf(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedPdfFile = event.target.files[0];
      const fileName = event.target.files[0].name;
      const fileLabel = document.getElementById('file-label-PDF') as HTMLLabelElement | null;
      if (fileLabel) {
        fileLabel.innerHTML = fileName;
      }
    }
  }

  loadWS(): void {
    this.wsService.getAllWorkshop().subscribe(
      (data) => {
        this.ws = data;
        console.log('WS:', this.ws);
      },
      (error) => {
        console.error('Error loading WS:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load WS. Please try again later.' });
      }
    );
  }

  saveWS(): void {
    if (this.selectedImageFile && this.selectedPdfFile) {
      const formData: FormData = new FormData();
      formData.append('imageFile', this.selectedImageFile);
      formData.append('pdfFile', this.selectedPdfFile);
      formData.append('Title', this.newWS.title);
      formData.append('Description', this.newWS.description);
      this.wsService.uploadWS(formData).subscribe(
        (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            const percentDone = event.total ? Math.round(100 * event.loaded / event.total) : 0;
            this.messageService.add({ severity: 'info', summary: 'Uploading!', detail: `File is ${percentDone}% uploaded.` });
          } else if (event instanceof HttpResponse) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Files uploaded successfully!' });
            this.loadWS();
            this.addDialogVisible = false;
            this.resetForm();
          }
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to upload files.' });
        }
      );
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Both image and PDF files must be selected.' });
    }
  }

  resetForm() {
    this.newWS = { title: '', description: '' };
    this.selectedImageFile  = null;
    this.selectedPdfFile = null;
    this.fileName = '';
    const fileInput = document.getElementById('file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  updateWS(item: any): void {
    const formData = new FormData();
    formData.append('title', this.newWS.title);
    formData.append('description', this.newWS.description);

    if (this.selectedImageFile) {
      formData.append('imageFile', this.selectedImageFile);
    } else if (item.image_Name) {
      formData.append('existingImageName', item.image_Name);
    }

    if (this.selectedPdfFile) {
      formData.append('pdfFile', this.selectedPdfFile);
    } else if (item.pdf_Name) {
      formData.append('existingPdfName', item.pdf_Name);
    }

    this.wsService.updateWS(item.id_Workshop, formData).subscribe(
      (event) => {
        if (event.type === HttpEventType.Response) {
          this.loadWS();
          this.resetForm();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Workshop updated successfully!' });
          this.updateDialogVisible = false;
        }
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update Workshop.' });
      }
    );
  }

  deleteWS() {
    if (this.itemToDelete) {
      this.wsService.deleteWS(this.itemToDelete.id_Workshop).subscribe(
        () => {
          console.log('Workshop deleted successfully');
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File deleted successfully!' });
          this.loadWS(); // Reload Workshop items after deletion
          this.deleteDialogVisible = false;
          this.itemToDelete = null;
        },
        (error) => {
          console.error('Error deleting Workshop:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete file.' });
          this.deleteDialogVisible = false;
          this.itemToDelete = null;
        }
      );
    }
  }


  showImage(imageUrl: string): void {
    this.imageToShow = imageUrl;
    this.isImageDialogVisible = true;
  }

  hideImage(): void {
    console.log('Closing image dialog...');
    this.isImageDialogVisible = false;
  }

  filterWS(): void {
    if (this.searchTerm) {
      this.ws = this.ws.filter(item => item.title.toLowerCase().includes(this.searchTerm.toLowerCase()));
    } else {
      this.loadWS();
    }
  }
}

