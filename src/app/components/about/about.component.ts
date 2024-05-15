import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, AfterViewInit {

  images_customers:any[] = [
    { name: 'Aptiv_logo.png' },
    { name: 'Fujikura logo.png' },
    { name: 'Lear_Corporation_logo.png' },
    { name: 'leoni-ag-logo.png' },
  ];

  images_partners:any[] = [
    { name: 'barsan_Logo_2021.png' },
    { name: 'Dachser_Logo_2021.png' },
    { name: 'logo sjl.png' },
    // { name: 'barsan_Logo_2021.png' },
    // { name: 'Dachser_Logo_2021.png' },
    // { name: 'logo sjl.png' },
  ];




  @ViewChild('logosContainer', { static: true }) logosContainer!: ElementRef;

  constructor() { }

  ngOnInit(): void {
    this.images_customers = this.images_customers.concat(this.images_customers);
    this.images_partners = this.images_partners.concat(this.images_partners);

  }

  ngAfterViewInit(): void {
    const customerSlides = this.logosContainer.nativeElement.querySelectorAll('.logos-slide');
    if (customerSlides.length > 0 && this.logosContainer.nativeElement) {
      customerSlides.forEach((slide: HTMLElement) => {
        const copy = slide.cloneNode(true);
        this.logosContainer.nativeElement.appendChild(copy);
      });
    } else {
      console.error("No customer slides found.");
    }
  
    const partnerSlides = this.logosContainer.nativeElement.querySelectorAll('.logos-slide');
    if (partnerSlides.length > 0 && this.logosContainer.nativeElement) {
      partnerSlides.forEach((slide: HTMLElement) => {
        const copy = slide.cloneNode(true);
        this.logosContainer.nativeElement.appendChild(copy);
      });
    } else {
      console.error("No partner slides found.");
    }
  }
  





}
