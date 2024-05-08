import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CarouselModule } from 'primeng/carousel';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, AfterViewInit {

  images_logos = [
    { name: 'DCimageTest.png' },
    { name: 'logo.png' },
    { name: 'logoDClarge.png' },
    { name: 'iconDC.png' },
    { name: 'logoDCtest.png' },
    { name: 'logolarge.png' },
  ];

  images_equ=[
    { name: '1.jpeg', title: 'Equipo 1', description: 'Descripcion del equipo 1' },
    { name: '2.jpeg', title: 'Equipo 1', description: 'Descripcion del equipo 1' },
    { name: '3.jpeg', title: 'Equipo 1', description: 'Descripcion del equipo 1' },
    { name: '4.jpeg', title: 'Equipo 1', description: 'Descripcion del equipo 1' },
    { name: '5.jpeg', title: 'Equipo 1', description: 'Descripcion del equipo 1' },
    { name: '6.jpeg', title: 'Equipo 1', description: 'Descripcion del equipo 1' },

  ];



  duplicatedImages: any[] = [];

  @ViewChild('logosContainer', { static: true }) logosContainer!: ElementRef;

  constructor() { }

  ngOnInit(): void {
    this.duplicatedImages = this.images_logos.concat(this.images_logos);
    this.startInterval();
  }

  ngAfterViewInit(): void {
    const copy = this.logosContainer.nativeElement.querySelector('.logos-slide');
    if (copy && this.logosContainer.nativeElement) {
      this.logosContainer.nativeElement.appendChild(copy);
    } else {
      console.error("One of the elements was not found.");
    }
  }
  currentIndex: number = 0;
  intervalId: any;

  
  prevSlide() {
    this.currentIndex = (this.currentIndex === 0) ? (this.images_equ.length - 1) : (this.currentIndex - 1);
    this.resetInterval();
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex === this.images_equ.length - 1) ? 0 : (this.currentIndex + 1);
    this.resetInterval();
  }

  startInterval() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  resetInterval() {
    clearInterval(this.intervalId);
    this.startInterval();
  }



}
