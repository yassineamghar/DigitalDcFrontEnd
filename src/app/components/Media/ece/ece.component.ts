import { HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ECE } from 'src/app/models/Media/ECE';
import { EceService } from 'src/app/services/ECE/ece.service';
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
  newEce: { Title: string, Description: string, Image_Name: string } = { Title: '', Description: '', Image_Name:''};
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
  originalEce: any[] = []; 


  constructor(
    private eceService: EceService,
    private messageService: MessageService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) { 
    this.searchTermChanged.pipe(
      debounceTime(800), 
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.filterECE();
    });
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
    this.newEce = { ...item }; 
    this.fileName = item.Image_Name || '';
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
        this.selectedFile = file;
        this.fileName = file.name;  // Update the fileName with the selected file's name
        const fileLabel = document.getElementById('file-label') as HTMLLabelElement;
        fileLabel.textContent = file.name;  // Update the label with the selected file's name
    } else {
        this.selectedFile = null;
        this.fileName = 'Choose file';  // Reset the fileName if no file is selected
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
    this.ece = [...this.originalEce];

  }

  saveECE(): void {
    if (this.selectedFile) {
      const formData: FormData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('Title', this.newEce.Title);
      formData.append('Description', this.newEce.Description);
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



resetForm() {
    this.newEce = { Title: '', Description: '', Image_Name:'' };
    this.selectedFile = null;
    this.fileName = '';
    const fileInput = document.getElementById('file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  updateECE(item: any): void {
    const formData = new FormData();
    formData.append('Title', this.newEce.Title);
    formData.append('Description', this.newEce.Description);

    if (this.selectedFile) {
        // If a new file is selected, append it to the form data
        formData.append('File', this.selectedFile);
    } else {
        // If no new file is selected, append the existing file name
        formData.append('existingFileName', this.fileName);
    }

    this.eceService.updateECE(item.Id_ECE, formData).subscribe(
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
      this.eceService.deleteECE(this.itemToDelete.Id_ECE).subscribe(
        () => {
          // console.log('ECE deleted successfully');
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File deleted successfully!' });
          this.loadECE(); 
          this.deleteDialogVisible = false;
          this.itemToDelete = null;
        },
        (error) => {
          // console.error('Error deleting ECE:', error);
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

  onSearchTermChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTermChanged.next(target.value);
  }
  

  filterECE(): void {
    if (this.searchTerm) {
      this.ece = this.ece.filter(item => item.Title.toLowerCase().includes(this.searchTerm.toLowerCase()));
      if (this.ece.length === 0) {
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'No ECE found matching the search term.' });
      }
    } else {
      this.loadECE();
      this.ece = this.ece;
    }
  }
  
}