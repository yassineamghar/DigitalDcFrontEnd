import { Component, OnInit } from '@angular/core';
import * as lightbox from 'lightbox2';

@Component({
  selector: 'app-board-news',
  templateUrl: './board-news.component.html',
  styleUrls: ['./board-news.component.css']
})
export class BoardNewsComponent implements OnInit{

  images=[
    { name: 'ECEAward_page-0001.jpg', caption: "ECE Star Award", description: "Many thanks Soufiane for the outstanding support you have provided to NAF DCs since joining the team. Excellent work, keep it up!" },
    { name: 'TE KSER-V2 -3 (1) (1).jpg', caption: "Plan d'évacuation", description: "Galleria can be controlled programmatically using the activeIndex property." },
    { name: 'image.png', caption: "Safety Instruction", description: "YOUR SAFETY IS OUR FIRST PRIORITY TE Connectivity Med Hub is committed to provide a safe and secure working Environment to all TE employees, customers, suppliers and visitors.  " },
  ];
  currentIndex: number = 0;
  intervalId: any;

  ngOnInit(): void {
    this.startInterval();
    lightbox.option({
        'resizeDuration': 200,
        'wrapAround': true,
        'disableScrolling': true, 
        'showImageNumberLabel': false,
        'disableKeyboardControls': true, 
        'alwaysShowNavOnTouchDevices': false,
    });

    // Hide the close button using CSS
    const closeButton = document.querySelector('.lightbox-close');
    if (closeButton) {
        closeButton.classList.add('hidden');
    }
    // Handle lightbox close event when clicking outside the image
    document.addEventListener('click', (event) => {
        if ((event.target as Element).classList.contains('lightbox')) {
            window.location.href = '/test';
        }
    });
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
}