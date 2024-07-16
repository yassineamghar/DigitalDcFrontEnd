import { HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Equipment } from 'src/app/models/Equipment/Equipment';
import { AuthService } from 'src/app/services/auth.service';
import { EquipmentService } from 'src/app/services/Equipment/equipment.service';
import * as lightbox from 'lightbox2';
import { MatDialog } from '@angular/material/dialog';
import { ImagePreviewComponent } from 'src/app/Materials/image-preview/image-preview.component';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css']
})
export class EquipmentComponent implements OnInit {
  visible: boolean = false;
  showUpdateForm: boolean = false;
  selectedFile: File | null = null;
  selectedEq: Equipment | any;
  eq: Equipment[] = [];
  newEq: { nameEQ: string, description: string, numbEQ: number } = { nameEQ: '', description: '', numbEQ: 0 };
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
  originalEq: any[] = []; 
  imageUrl: string='';
  // isZoomed = false;

  // toggleZoom() {
  //   this.isZoomed = !this.isZoomed;
  // }


  constructor(
    private eqService: EquipmentService,
    private messageService: MessageService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
  ) { 
    this.searchTermChanged.pipe(
      debounceTime(800), // Adjust the debounce time as needed
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.filterEquipment();
    });
  }


  showAlert() {
    alert('Button clicked!');
  }

  @ViewChild('fileInput') fileInput!: ElementRef;

  ngOnInit(): void {
    this.loadEquipment();
    this.isAuthorized = this.checkUserAuthorization();
    this.cdr.detectChanges();
    lightbox.option({
      'resizeDuration': 200,
      'wrapAround': true
    });
  }

  checkUserAuthorization(): boolean {
    const userRoles = this.authService.getUserRoles();
    const isAdminOrUser = userRoles.includes('Admin') || userRoles.includes('User');
    this.loadEquipment();
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
    this.newEq = { ...item };
    this.updateDialogVisible = true;
  }

  showDeleteDialog(item: any): void {
    this.itemToDelete = item;
    this.deleteDialogVisible = true;
  }

  selectEquipment(item: Equipment): void {
    this.selectedEq = item;
    this.newEq = { ...item }; // Pre-fill the form with the selected item details
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


  loadEquipment(): void {
    this.eqService.getAllEquipment().subscribe(
      (data) => {
        this.eq = data;
        console.log('Equipments:', data);
      },
      (error) => {
        console.error('Error loading Equipment:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load Equipment. Please try again later.' });
      }
    );
    this.eq = [...this.originalEq];
  }

  saveEquipment(): void {
    if (this.selectedFile) {
      const formData: FormData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('NameEQ', this.newEq.nameEQ);
      formData.append('NumbEQ', this.newEq.numbEQ.toString().padStart(2, '0'));// Convert number to string
      formData.append('Description', this.newEq.description);
      this.eqService.uploadEquipment(formData).subscribe(
        (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            const percentDone = event.total ? Math.round(100 * event.loaded / event.total) : 0;
            this.messageService.add({ severity: 'info', summary: 'Uploading!!', detail: `File is ${percentDone}% uploaded.` });
            this.loadEquipment();
          } else if (event instanceof HttpResponse) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File uploaded successfully!' });
            this.loadEquipment();
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
    this.newEq = { nameEQ: '', description: '', numbEQ: 0 };
    this.selectedFile = null;
    this.fileName = '';
    const fileInput = document.getElementById('file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  updateEquipment(item: any): void {
    const formData = new FormData();
    formData.append('NameEQ', this.newEq.nameEQ);
    formData.append('NumbEQ', this.newEq.numbEQ.toString().padStart(2, '0')); // Convert number to string
    formData.append('description', this.newEq.description);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    } else if (this.fileName !== 'Choose file') {
      formData.append('existingFileName', this.fileName);
    }

    this.eqService.updateEquipment(item.id_EQ, formData).subscribe(
      (event) => {
        if (event.type === HttpEventType.Response) {
          this.loadEquipment();
          this.resetForm();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Equipment updated successfully!' });
          this.updateDialogVisible = false;
        }
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update Equipment.' });
      }
    );
  }

  deleteEquipment() {
    if (this.itemToDelete) {
      this.eqService.deleteEquipment(this.itemToDelete.id_EQ).subscribe(
        () => {
          console.log('Equipment deleted successfully');
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File deleted successfully!' });
          this.loadEquipment(); 
          this.deleteDialogVisible = false;
          this.itemToDelete = null;
        },
        (error) => {
          console.error('Error deleting Equipment:', error);
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
  

  filterEquipment(): void {
    if (this.searchTerm) {
      this.eq = this.eq.filter(item => item.nameEQ.toLowerCase().includes(this.searchTerm.toLowerCase()));
      if (this.eq.length === 0) {
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'No ECE found matching the search term.' });
      }
    } else {
      this.loadEquipment();
      this.eq = this.eq;
    }
  }

  formatTwoDigits(value: number): string {
    return value.toString().padStart(2, '0');
  }

  openImagePreview() {
    const dialogRef = this.dialog.open(ImagePreviewComponent, {
      data: { imageUrl: this.imageUrl }
    });
  }
  
}