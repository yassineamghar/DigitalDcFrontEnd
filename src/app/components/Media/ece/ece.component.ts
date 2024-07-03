import { HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { ECE } from 'src/app/models/Media/ECE';
import { EceService } from 'src/app/services/ECE/ece.service';
import { NotificationService } from 'src/app/services/Notification/notification.service';
import { PdfService } from 'src/app/services/PDF/pdf.service';
import { AuthService } from 'src/app/services/auth.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-ece',
  templateUrl: './ece.component.html',
  styleUrls: ['./ece.component.css']
})
export class ECEComponent implements OnInit {
  visible: boolean = false;
  showUpdateForm: boolean = false;
  selectedFile: File | null = null;
  selectedECE: ECE | any;
  ece: ECE[] = [];
  newEce: { title: string, description: string } = { title: '', description: '' };
  fileName: string = '';
  imageToShow: string | null = null;
  isImageDialogVisible = false;
  searchTerm: string = '';
  isAuthorized: boolean = false;
  addDialogVisible: boolean = false;
  updateDialogVisible: boolean = false;
  deleteDialogVisible: boolean = false;
  itemToDelete: any;
  searchTermChanged: Subject<string> = new Subject<string>();
  originalEce: any[] = []; // Backup of the original ECE array



  constructor(
    private eceService: EceService,
    private notificationService: NotificationService,
    private messageService: MessageService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) { 
    this.searchTermChanged.pipe(
      debounceTime(800), // Adjust the debounce time as needed
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.filterECE();
    });
  }


  showAlert() {
    alert('Button clicked!');
  }

  @ViewChild('fileInput') fileInput!: ElementRef;

  ngOnInit(): void {
    this.loadECE();
    this.isAuthorized = this.checkUserAuthorization();
    // Force change detection after updating isAuthorized
    this.cdr.detectChanges();
  }
  checkUserAuthorization(): boolean {
    const userRoles = this.authService.getUserRoles();
    const isAdminOrUser = userRoles.includes('Admin') || userRoles.includes('User');
    this.loadECE();
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
    this.newEce = { ...item };
    this.updateDialogVisible = true;
  }

  showDeleteDialog(item: any): void {
    this.itemToDelete = item;
    this.deleteDialogVisible = true;
  }

  selectECE(item: ECE): void {
    this.selectedECE = item;
    this.newEce = { ...item }; // Pre-fill the form with the selected item details
    this.fileName = item.image_Name || '';
  }

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      const fileName = event.target.files[0].name;
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
        console.log('ECE:', this.ece);
      },
      (error) => {
        console.error('Error loading ECE:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load ECE. Please try again later.' });
      }
    );
    this.ece = [...this.originalEce]; // Reset the 'ece' array

  }

  saveECE(): void {
    if (this.selectedFile) {
      const formData: FormData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('Title', this.newEce.title);
      formData.append('Description', this.newEce.description);
      this.eceService.uploadECE(formData).subscribe(
        (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            const percentDone = event.total ? Math.round(100 * event.loaded / event.total) : 0;
            this.messageService.add({ severity: 'info', summary: 'Uploading!!', detail: `File is ${percentDone}% uploaded.` });
            this.loadECE();
          } else if (event instanceof HttpResponse) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File uploaded successfully!' });
            this.loadECE();
            this.addDialogVisible = false;
            this.resetForm();
          }
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to upload file.' });
        }
      );
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'No file selected.' });
    }
  }



  private getHttpOptions(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    console.log (token);
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      })
    };
  }




  resetForm() {
    this.newEce = { title: '', description: '' };
    this.selectedFile = null;
    this.fileName = '';
    const fileInput = document.getElementById('file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  updateECE(item: any): void {
    const formData = new FormData();
    formData.append('title', this.newEce.title);
    formData.append('description', this.newEce.description);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    } else if (this.fileName !== 'Choose file') {
      formData.append('existingFileName', this.fileName);
    }

    this.eceService.updateECE(item.id_ECE, formData).subscribe(
      (event) => {
        if (event.type === HttpEventType.Response) {
          this.loadECE();
          this.resetForm();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'ECE updated successfully!' });
          this.updateDialogVisible = false;
        }
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update ECE.' });
      }
    );
  }

  deleteECE() {
    if (this.itemToDelete) {
      this.eceService.deleteECE(this.itemToDelete.id_ECE).subscribe(
        () => {
          console.log('ECE deleted successfully');
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File deleted successfully!' });
          this.loadECE(); // Reload ECE items after deletion
          this.deleteDialogVisible = false;
          this.itemToDelete = null;
        },
        (error) => {
          console.error('Error deleting ECE:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete file.' });
          this.deleteDialogVisible = false;
          this.itemToDelete = null;
        }
      );
    }
  }


  showImage(imageUrl: string): void {
    this.imageToShow = imageUrl;
    this.isImageDialogVisible = true; // Set dialog visible when showing image
  }

  hideImage(): void {
    console.log('Closing image dialog...');
    this.isImageDialogVisible = false;
  }

  onSearchTermChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTermChanged.next(target.value);
  }
  

  filterECE(): void {
    if (this.searchTerm) {
      const filteredItems = this.originalEce.filter(item =>
        item.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      if (filteredItems.length > 0) {
        this.ece = filteredItems;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Not found.' });
        this.ece = []; // Clear the list or show an empty state
      }
    } else {
      this.loadECE(); // Reload the original ECE list
    }
  }
  
}