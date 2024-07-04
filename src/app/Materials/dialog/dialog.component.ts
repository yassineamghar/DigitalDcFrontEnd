import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit{
 
  isClosed = false;
  isLoading = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private sanitizer: DomSanitizer) {
    setTimeout(() => {
      this.isLoading = false;
    }, 1000); 
  }

  ngOnInit(): void {
    // Any initialization logic if required
  }

  getSafeUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.data?.url || '');
  }

  onLoad(): void {
    this.isLoading = false;
  }

  closeIframe(): void {
    this.isClosed = true;
    console.log('Closing iframe');
  }
}

