import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  
  isAuthorized: boolean = false;


  images_customers: any[] = [
    { name: 'Aptiv_logo.png' },
    { name: 'Fujikura logo.png' },
    { name: 'Lear_Corporation_logo.png' },
    { name: 'leoni-ag-logo.png' },
  ];

  images_partners: any[] = [
    { name: 'barsan_Logo_2021.png' },
    { name: 'Dachser_Logo_2021.png' },
    { name: 'logo sjl.png' },
  ];

  @ViewChild('logosContainer', { static: true }) logosContainer!: ElementRef;

  constructor(private authService: AuthService,     private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.populateImages(this.images_customers, 100, 100);
    this.populateImages(this.images_partners, 100, 100);
    this.isAuthorized = this.checkUserAuthorization();
    // Force change detection after updating isAuthorized
    this.cdr.detectChanges();
  }
  checkUserAuthorization(): boolean {
    const userRoles = this.authService.getUserRoles();
    const isAdminOrUser = userRoles.includes('Admin') || userRoles.includes('User');
    // this.loadECE();
    return isAdminOrUser;
  }
  populateImages(imagesArray: any[], desiredSize: number, delay: number): void {
    const originalImages = [...imagesArray];
    const appendImage = () => {
      if (imagesArray.length < desiredSize) {
        imagesArray.push(...originalImages);
        setTimeout(appendImage, delay);
      }
    };
    appendImage();
  }
}
