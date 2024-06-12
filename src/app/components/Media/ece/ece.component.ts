import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ECE } from 'src/app/models/Media/ECE';
import { EceService } from 'src/app/services/ECE/ece.service';
import { NotificationService } from 'src/app/services/Notification/notification.service';
import { PdfService } from 'src/app/services/PDF/pdf.service';

@Component({
  selector: 'app-ece',
  templateUrl: './ece.component.html',
  styleUrls: ['./ece.component.css']
})
export class ECEComponent implements OnInit {
  selectedFile: File | null = null;
  selectedECE: ECE | null = null;
  ece: ECE[] = [];

  constructor(
    private eceService: EceService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadECE();
  }

  loadECE(): void {
    this.eceService.getAllECE().subscribe(
      (data) => {
        this.ece = data;
        this.notificationService.showSuccess('ECE loaded successfully.');
      },
      (error) => {
        console.error('Error loading ECE:', error);
        this.notificationService.showError('Failed to load ECE. Please try again later.');
      }
    );
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadECE(): void {
    if (!this.selectedFile) {
      console.error('No file selected.');
      return;
    }

    this.eceService.uploadECE(this.selectedFile).subscribe(
      () => {
        console.log('File uploaded successfully.');
        this.loadECE();
      },
      (error) => {
        console.error('Error uploading file:', error);
      }
    );
  }

  selectECE(ece: ECE): void {
    this.selectedECE = ece;
  }

  updateECE(): void {
    if (!this.selectedECE || !this.selectedFile) {
      console.error('No ECE selected or no file provided.');
      return;
    }

    this.eceService.updateECE(this.selectedECE.id_ECE, this.selectedFile).subscribe(
      () => {
        console.log('ECE updated successfully.');
        this.loadECE();
      },
      (error) => {
        console.error('Error updating ECE:', error);
      }
    );
  }

  deleteECE(): void {
    if (!this.selectedECE) {
      console.error('No ECE selected.');
      return;
    }

    this.eceService.deleteECE(this.selectedECE.id_ECE).subscribe(
      () => {
        console.log('ECE deleted successfully.');
        this.loadECE();
        this.selectedECE = null;
      },
      (error) => {
        console.error('Error deleting ECE:', error);
      }
    );
  }
}