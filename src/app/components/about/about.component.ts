import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

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

  constructor() { }

  ngOnInit(): void {
    this.populateImages(this.images_customers, 100, 100);
    this.populateImages(this.images_partners, 100, 100);
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
