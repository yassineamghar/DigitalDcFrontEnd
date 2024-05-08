import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, AfterViewInit {

  // Define your images array
  images = [
    { name: 'DCimageTest.png' },
    { name: 'logo.png' },
    { name: 'logoDClarge.png' },
    { name: 'iconDC.png' },
    { name: 'logoDCtest.png' },
    { name: 'logolarge.png' },
  ];

  duplicatedImages: any[] = [];

  @ViewChild('logosContainer', { static: true }) logosContainer!: ElementRef;

  constructor() { }

  ngOnInit(): void {
    this.duplicatedImages = this.images.concat(this.images);
  }

  ngAfterViewInit(): void {
    const copy = this.logosContainer.nativeElement.querySelector('.logos-slide');
    if (copy && this.logosContainer.nativeElement) {
      this.logosContainer.nativeElement.appendChild(copy);
    } else {
      console.error("One of the elements was not found.");
    }
  }

}
