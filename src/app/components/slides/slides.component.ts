import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-slides',
  templateUrl: './slides.component.html',
  styleUrls: ['./slides.component.css']
})
export class SlidesComponent implements OnInit{

  images=[
    {name: '1.avif', caption:""},
    {name: '2.avif', caption:""},
    

  ];
  ngOnInit() {
      
  }
  
  elem=document.documentElement;
  fullscreen(){
    if(this.elem.requestFullscreen){
      this.elem.requestFullscreen();
  }}

  mainSlides = [
    {
      subSlides: [
        { image: '4.webp' },
        { image: '5.webp' },
        { image: '6.webp' }
      ]
    },
    {
      subSlides: [
        { image: '1.avif' },
        { image: '2.avif' },
        { image: '3.avif' }
      ]
    },
    {
      subSlides: [
        { image: '7.webp' },
        { image: '8.webp' },
        { image: '9.webp' }
      ]
    },
    // Add more main slides as needed
  ];

  activeMainSlide: number = 0; // Index of active main slide
  activeSubSlide: number[] = []; // Array to hold index of active sub slide for each main slide

  constructor() {
    // Initialize activeSubSlide array with zeros for each main slide
    this.activeSubSlide = this.mainSlides.map(() => 0);
  }

  // Function to navigate to previous sub slide of a main slide
  prevSubSlide(mainIndex: number) {
    if (this.activeSubSlide[mainIndex] > 0) {
      this.activeSubSlide[mainIndex]--;
    }
  }

  // Function to navigate to next sub slide of a main slide
  nextSubSlide(mainIndex: number) {
    const totalSubSlides = this.mainSlides[mainIndex].subSlides.length;
    if (this.activeSubSlide[mainIndex] < totalSubSlides - 1) {
      this.activeSubSlide[mainIndex]++;
    }
  }

  // Function to go to a specific main slide
  goToSlide(index: number) {
    this.activeMainSlide = index;
  }

  
}
