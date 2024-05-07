import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board-fs',
  templateUrl: './board-fs.component.html',
  styleUrls: ['./board-fs.component.css']
})
export class BoardFSComponent implements OnInit{

  images=[
    {name: '1.avif', caption:"hello", description:"Galleria requires a value as a collection of images, item template for the higher resolution image and thumbnail template to display as a thumbnail."},
    {name: '2.avif', caption:"by", description:"Galleria can be controlled programmatically using the activeIndex property."},
    {name: '3.avif', caption:"by", description:"Galleria can be controlled programmatically using the activeIndex property."},
    

  ];
  elem=document.documentElement;
  fullscreen(){
    if(this.elem.requestFullscreen){
      this.elem.requestFullscreen();
  }}
  currentIndex: number = 0;
  intervalId: any;

  ngOnInit() {
    // Start automatic sliding
    this.startInterval();
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
    }, 3000); // Interval set to 3000 milliseconds (3 seconds)
  }

  resetInterval() {
    clearInterval(this.intervalId);
    this.startInterval();
  }
}