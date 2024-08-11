import { WorkshopService } from './../../../services/Workshop/workshop.service';
import { HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FileUploadEvent } from 'primeng/fileupload';
import { DialogComponent } from 'src/app/Materials/dialog/dialog.component';
import { workshop } from 'src/app/models/Workshop/workshop';
// import { NotificationService } from 'src/app/services/Notification/notification.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-workshop',
  templateUrl: './workshop.component.html',
  styleUrls: ['./workshop.component.css']
})
export class WorkshopComponent implements OnInit {

  visible: boolean = false;
  showUpdateForm: boolean = false;
  selectedImageFiles: File[] = [];
  selectedPdfFiles: File[] = [];
  selectedVideoFile: File | null = null;
  selectedWS: workshop | any;
  ws: workshop[] = [];
  newWS: { Title: string; Description: string, Image_Name: string[], Image_URL: string[]; Pdf_URL: string[], Pdf_Name: string[], Video_Name: string } = { Title: '', Description: '', Image_Name: [], Pdf_Name: [], Image_URL: [], Pdf_URL: [], Video_Name: '' };
  filesToDelete: { ImageNames: string[], PdfNames: string[], VideoName: string | null } = { ImageNames: [], PdfNames: [], VideoName: null };
  workshopData: any = {};
  fileName: string = '';
  imageToShow: string | null = null;
  isImageDialogVisible = false;
  searchTerm: string = '';
  selectedWorkshopId: string = '';
  isAuthorized: boolean = false;
  addDialogVisible: boolean = false;
  updateDialogVisible: boolean = false;
  deleteDialogVisible: boolean = false;
  itemToDelete: any;
  uploadedFiles: any[] = [];
  uploadedPdfFiles: any[] = [];
  uploadedVideoFiles: any[] = [];
  errorMessage: string | null = null;
  @Output() workshopSelected: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private wsService: WorkshopService,
    // private notificationService: NotificationService,
    private messageService: MessageService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router

  ) { }

  @ViewChild('fileInput') fileInput!: ElementRef;

  ngOnInit(): void {
    this.loadWS();
    this.isAuthorized = this.checkUserAuthorization();
    // Force change detection after updating isAuthorized
    this.cdr.detectChanges();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getWorkshopById(id);
    }

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
    this.selectedWorkshopId = item.Id_Workshop; // Set the selected workshop ID
    this.updateDialogVisible = true;
  }

  showDeleteDialog(item: any): void {
    this.itemToDelete = item;
    this.deleteDialogVisible = true;
  }

  onFilesSelected(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      if (type === 'images') {
        this.selectedImageFiles = Array.from(input.files);
        this.workshopData.image_Name = this.selectedImageFiles.map(file => file.name);
      } else if (type === 'pdfs') {
        this.selectedPdfFiles = Array.from(input.files);
        this.workshopData.pdf_Name = this.selectedPdfFiles.map(file => file.name);
      }
    }
  }


  onFileSelected(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      if (type === 'video') {
        this.selectedVideoFile = input.files[0];
        this.workshopData.video_Name = this.selectedVideoFile.name;
      }
    }
  }


  FileSelected(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && type === 'video') {
      this.selectedVideoFile = input.files[0];
    }
  }

  loadWS(): void {
    this.wsService.getAllWorkshop().subscribe(
      (data) => {
        this.ws = data;
        this.wsService.setSelectedWorkshop(data);
        console.log('WS:', this.ws);
      },
      (error) => {
        console.error('Error loading WS:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load WS. Please try again later.' });
      }
    );
  }

  getWorkshopById(id: string): void {
    this.wsService.getWorkshopById(id).subscribe(response => {
      this.ws = response.WorkshopDto;
    });
  }


  onUpload(event: any): void {
    this.selectedImageFiles = event.files; // Assuming multiple images can be selected
    this.uploadedFiles = event.files;
    this.errorMessage = null; // Clear any previous error messages
  }

  onPdfUpload(event: any): void {
    this.selectedPdfFiles = event.files; // Assuming multiple PDFs can be selected
    this.uploadedPdfFiles = event.files;
    this.errorMessage = null; // Clear any previous error messages
  }

  onVideoUpload(event: any): void {
    if (event.files.length === 1) {
      this.selectedVideoFile = event.files[0];
      this.uploadedVideoFiles = event.files;
      this.errorMessage = null; // Clear any previous error messages
    } else {
      this.errorMessage = 'Please select only one video file.';
      this.selectedVideoFile = null; // Reset if not exactly one file is selected
      this.uploadedVideoFiles = [];
    }
  }

  saveWS(): void {
    if (
      this.selectedImageFiles.length > 0 &&
      this.selectedPdfFiles.length > 0 &&
      this.selectedVideoFile
    ) {
      const formData: FormData = new FormData();
      formData.append('Title', this.newWS.Title);
      formData.append('Description', this.newWS.Description);

      this.selectedImageFiles.forEach(file => {
        formData.append('imageFiles', file);
      });

      this.selectedPdfFiles.forEach(file => {
        formData.append('pdfFiles', file);
      });

      if (this.selectedVideoFile) {
        formData.append('videoFile', this.selectedVideoFile);
      }
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
          console.error('Upload error:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to upload files.' });
        }
      );
    } else {
      this.errorMessage = 'All file types (images, PDFs, and video) must be selected.';
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: this.errorMessage });
    }
  }

  openDialog(workshopId: string): void {
    this.wsService.getWorkshopById(workshopId).subscribe(data => {
      this.workshopData = data;
      this.updateDialogVisible = true;
    });
  }

  resetForm() {
    this.newWS = {
      Title: '',
      Description: '',
      Image_Name: [],
      Pdf_Name: [],
      Image_URL: [],
      Pdf_URL: [],
      Video_Name: ''
    };
    this.filesToDelete = { ImageNames: [], PdfNames: [], VideoName: null };
    this.selectedImageFiles = [];
    this.selectedPdfFiles = [];
    this.selectedVideoFile = null;
    this.uploadedFiles = [];
    this.uploadedPdfFiles = [];
    this.uploadedVideoFiles = [];
    this.errorMessage = null;  // Clear any error messages

    // Clear file input values
    const imageInput = document.getElementById('image-files') as HTMLInputElement;
    if (imageInput) {
      imageInput.value = '';
    }

    const pdfInput = document.getElementById('pdf-files') as HTMLInputElement;
    if (pdfInput) {
      pdfInput.value = '';
    }

    const videoInput = document.getElementById('video-file') as HTMLInputElement;
    if (videoInput) {
      videoInput.value = '';
    }
  }

  // markForDeletion(type: 'image' | 'pdf' | 'video', item: string) {
  //   if (type === 'image') {
  //     this.filesToDelete.ImageNames.push(item);
  //   } else if (type === 'pdf') {
  //     this.filesToDelete.PdfNames.push(item);
  //   } else if (type === 'video') {
  //     this.filesToDelete.VideoName = item;
  //   }
  // }

  saveChanges() {
    // Remove images marked for deletion
    this.newWS.Image_Name = this.newWS.Image_Name.filter(image => {
      const shouldDelete = this.filesToDelete.ImageNames.includes(image.replace('[Deleted] ', ''));
      if (shouldDelete) {
        console.log('Removing image:', image);
      }
      return !shouldDelete;
    });
    console.log('Updated Images:', this.newWS.Image_Name);

    // Remove PDFs marked for deletion
    this.newWS.Pdf_Name = this.newWS.Pdf_Name.filter(pdf => {
      const shouldDelete = this.filesToDelete.PdfNames.includes(pdf);
      if (shouldDelete) {
        console.log('Removing PDF:', pdf);
      }
      return !shouldDelete;
    });
    console.log('Updated PDFs:', this.newWS.Pdf_Name);

    // Remove video if marked for deletion
    if (this.filesToDelete.VideoName === this.newWS.Video_Name) {
      console.log('Removing video:', this.newWS.Video_Name);
      this.newWS.Video_Name = '';
    }
    console.log('Updated Video:', this.newWS.Video_Name);

    // Call your update method to save changes
    this.updateWS();

    // Clear the deletion markers
    this.filesToDelete = { ImageNames: [], PdfNames: [], VideoName: null };
  }




  removeImage(index: number) {
    if (this.newWS.Image_Name && this.selectedImageFiles) {
      if (index >= 0 && index < this.newWS.Image_Name.length) {
        const fileName = this.newWS.Image_Name[index];
        // Add to filesToDelete
        this.filesToDelete.ImageNames.push(fileName);
        // Mark the image for deletion
        this.newWS.Image_Name[index] = '[Deleted] ' + fileName;
        this.newWS.Image_URL[index] = ''; // Also clear URL
      } else {
        console.warn('Invalid index:', index);
      }
    } else {
      console.error('Lists are not initialized or empty.');
    }
  }

  removePdf(index: number) {
    if (this.newWS.Pdf_Name && this.selectedPdfFiles) {
      if (index >= 0 && index < this.newWS.Pdf_Name.length) {
        const fileName = this.newWS.Pdf_Name[index];
        // Add to filesToDelete
        this.filesToDelete.PdfNames.push(fileName);
        // Mark the PDF for deletion
        this.newWS.Pdf_Name[index] = '[Deleted] ' + fileName;
        this.newWS.Pdf_URL[index] = ''; // Also clear URL
      } else {
        console.warn('Invalid index:', index);
      }
    } else {
      console.error('Lists are not initialized or empty.');
    }
  }

  removeVideo() {
    if (this.newWS.Video_Name) {
      // Mark video for deletion
      this.filesToDelete.VideoName = this.newWS.Video_Name;
      this.newWS.Video_Name = '[Deleted] ' + this.newWS.Video_Name;
    } else {
      console.error('No video to remove.');
    }
  }

  handleCancel() {
    // Reset form and lists to original state
    this.resetForm();
    this.updateDialogVisible = false;
  }


  updateWS(): void {
    if (!this.selectedWorkshopId) {
      this.errorMessage = 'Workshop ID is required for updating.';
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: this.errorMessage });
      return;
    }

    const formData: FormData = new FormData();
    formData.append('Title', this.newWS.Title || '');
    formData.append('Description', this.newWS.Description || '');

    // Append image files
    this.selectedImageFiles.forEach(file => {
      formData.append('imageFiles', file, file.name);
    });

    // Append PDF files
    this.selectedPdfFiles.forEach(file => {
      formData.append('pdfFiles', file, file.name);
    });

    // Append video file only if a new one is provided
    if (this.selectedVideoFile) {
      formData.append('videoFile', this.selectedVideoFile, this.selectedVideoFile.name);
    }

    // Append files to delete
    formData.append('filesToDelete', JSON.stringify(this.filesToDelete));

    // Call the update service method
    this.wsService.updateWS(this.selectedWorkshopId, formData).subscribe(
      (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          const percentDone = event.total ? Math.round(100 * event.loaded / event.total) : 0;
          this.messageService.add({ severity: 'info', summary: 'Uploading!', detail: `File is ${percentDone}% uploaded.` });
        } else if (event instanceof HttpResponse) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Workshop updated successfully!' });
          this.loadWS();  // Reload the list of workshops or refresh the UI
          this.updateDialogVisible = false;  // Close any open dialogs
          this.resetForm();  // Reset the form fields
        }
      },
      (error) => {
        console.error('Update error:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update workshop.' });
      }
    );
  }


  deleteWS() {
    if (this.itemToDelete) {
      this.wsService.deleteWS(this.itemToDelete.Id_Workshop).subscribe(
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
      this.ws = this.ws.filter(item => item.Title.toLowerCase().includes(this.searchTerm.toLowerCase()));
    } else {
      this.loadWS();
    }
  }

  // viewWS(id: string): void {
  //   this.wsService.downloadArticleFile(id).subscribe(blob => {
  //     const url = URL.createObjectURL(blob);
  //     const fileType = blob.type;

  //     const dialogRef = this.dialog.open(DialogComponent, {
  //       width: '1000px',
  //       data: { url: url, fileType: fileType }
  //     });

  //     dialogRef.afterClosed().subscribe(result => {
  //       console.log('The dialog was closed');
  //       this.loadWS();
  //     });
  //   }, error => {
  //     console.error('Error fetching article file:', error);
  //   });
  // }

  showWorkshopDetails(id: string) {
    this.router.navigate(['/workshop', id]);
  }

}

