import { HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as lightbox from 'lightbox2';
import { MessageService } from 'primeng/api';
import { BoardNews } from 'src/app/models/BoardNews/BoardNews';
import { AuthService } from 'src/app/services/auth.service';
import { BoardnewsService } from 'src/app/services/BoardNews/boardnews.service';

@Component({
  selector: 'app-board-news',
  templateUrl: './board-news.component.html',
  styleUrls: ['./board-news.component.css']
})
export class BoardNewsComponent implements OnInit{
  @ViewChild('carouselElement') carouselElement!: ElementRef; 

  newBN: any = {
    Title: '',
    Description: '',
    File: null
  };
  selectedFile: File | null = null;
  fileName: string = '';
  addDialogVisible: boolean = false;
  updateDialogVisible: boolean = false;
  BN: BoardNews[] = [];
  originalBN: any[] = [];
  isAuthorized: boolean = false;
  currentIndex: number = 0;
  intervalId: any;
  images: any[] = [];
  uploadProgress: number = 0;
  updateItemId: string = '';

  selectedBN: any = {
    Title: '',
    Description: '',
    File: null
  };

  constructor(
    private BNService: BoardnewsService,
    private messageService: MessageService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.startInterval();
    this.loadBN();
    this.isAuthorized = this.checkUserAuthorization();
  }

  checkUserAuthorization(): boolean {
    const userRoles = this.authService.getUserRoles();
    return userRoles.includes('Admin') || userRoles.includes('User');
  }
  prevSlide() {
    this.currentIndex = (this.currentIndex === 0) ? (this.images.length - 1) : (this.currentIndex - 1);
    this.resetInterval();
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex === this.images.length - 1) ? 0 : (this.currentIndex + 1);
    this.resetInterval();
  }

  startInterval() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }


  resetInterval() {
    clearInterval(this.intervalId);
    this.startInterval();
  }

  showAddDialog() {
    this.addDialogVisible = true;
  }

  showUpdateDialog() {
    if (this.images.length > 0) {
      const selectedItem = this.images[this.currentIndex];
      this.selectedBN = {
        Title: selectedItem.caption,
        Description: selectedItem.description,
        File: null
      };
      this.updateItemId = selectedItem.id; 
      this.updateDialogVisible = true;
    }
  }

  resetForm() {
    this.newBN = {
      Title: '',
      Description: '',
      File: null
    };
    this.selectedBN = {
      Title: '',
      Description: '',
      File: null
    };
    this.selectedFile = null;
    this.uploadProgress = 0;
    this.updateItemId = ''; 
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const fileLabel = document.getElementById('file-label') as HTMLLabelElement;
      fileLabel.innerText = file.name;
    }
  }

  onSubmit() {
    if (!this.selectedFile) {
      this.messageService.add({ severity: 'warn', summary: 'No File Selected', detail: 'Please select an image file.' });
      return;
    }

    const formData = new FormData();
    formData.append('Title', this.newBN.Title);
    formData.append('Description', this.newBN.Description);
    formData.append('File', this.selectedFile);

    this.BNService.uploadBN(formData).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round((100 * event.loaded) / (event.total || 1));
        } else if (event.type === HttpEventType.Response) {
          this.messageService.add({ severity: 'success', summary: 'Upload Successful', detail: 'Board News has been uploaded.' });
          this.addDialogVisible = false;
          this.resetForm();
          this.loadBN();
        }
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Upload Failed', detail: 'An error occurred while uploading the image.' });
        // console.error('Upload error', error);
      }
    });
  }

  onUpdate() {
    if (this.updateItemId === null) {
      console.error('No item ID found for update.');
      return;
    }
  
    // Fetch all Board News items to check the ItemType
    this.BNService.getAllBN().subscribe({
      next: (data: any[]) => {
        // Find the item being updated
        const itemToUpdate = data.find(item => item.Id === this.updateItemId);
  
        if (itemToUpdate) {
          // Check the ItemType and handle accordingly
          if (itemToUpdate.ItemType === 'ECE' || itemToUpdate.ItemType === 'Workshop') {
            this.messageService.add({ severity: 'error', summary: 'Update Failed', detail: 'You cannot update this item.' });
            return;
          }
  
          // Proceed with the update if ItemType is not restricted
          const formData = new FormData();
          formData.append('Title', this.selectedBN.Title);
          formData.append('Description', this.selectedBN.Description);
          if (this.selectedFile) {
            formData.append('File', this.selectedFile);
          }
  
          // Use a flag to prevent duplicate messages
          let successMessageShown = false;
  
          this.BNService.updateBN(this.updateItemId, formData).subscribe({
            next: () => {
              if (!successMessageShown) {
                this.messageService.add({ severity: 'success', summary: 'Update Successful', detail: 'Board News has been updated.' });
                successMessageShown = true; // Prevent further success messages
              }
              this.updateDialogVisible = false;
              this.resetForm();
              this.loadBN();
            },
            error: (error) => {
              this.messageService.add({ severity: 'error', summary: 'Update Failed', detail: 'An error occurred while updating the Board News.' });
              // console.error('Update error:', error);
            }
          });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Upload Failed', detail: 'Item not found in combined items.' });

          // console.error('Item not found in combined items.');
        }
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Upload Failed', detail: 'Error loading combined items.' });

        // console.error('Error loading combined items:', error);
      }
    });
  }
  
  
  
  

  showDeleteDialog() {
    console.log('Current index:', this.currentIndex);
    console.log('Images:', this.images);
  
    const selectedItemId = this.images[this.currentIndex]?.id;
    console.log('Selected Item ID:', selectedItemId);
  
    if (!selectedItemId) {
      console.error('No ID found for the selected item.');
      return;
    }
  
    if (confirm('Are you sure you want to delete this item?')) {
      this.BNService.deleteBN(selectedItemId).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Delete Successful', detail: 'Board News has been deleted.' });
          this.loadBN();
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Delete Failed', detail: 'An error occurred while deleting the Board News.' });
          console.error('Delete error', error);
        }
      });
    }
  }

  loadBN() {
    this.BNService.getAllBN().subscribe((data: BoardNews[]) => {
      this.images = data.map((item: BoardNews) => ({
        id: item.Id,
        name: item.Image_URL,
        caption: item.Title,
        description: item.Description,
        dateCreated: item.DateCreated,
      }));
      // console.log('Images after loading:', this.images);
    }, error => {
      console.error('Error loading images:', error);
    });
  }
}