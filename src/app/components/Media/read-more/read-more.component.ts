import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SafeResourceUrl,DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { WorkshopService } from 'src/app/services/Workshop/workshop.service';

@Component({
  selector: 'app-read-more',
  templateUrl: './read-more.component.html',
  styleUrls: ['./read-more.component.css']
})
export class ReadMoreComponent implements OnInit, OnDestroy{
  videoURL: string | undefined;  
  images=[]
  
  @Input() workshopDetails: any;
  currentIndex = 0;
  intervalId: any;
 
  constructor(private route: ActivatedRoute, private wsService: WorkshopService, private sanitizer: DomSanitizer) { }

  // constructor(private workshopDataService: WorkshopService) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.wsService.getWorkshopById(id).subscribe(
          (workshop) => {
            this.workshopDetails = workshop;
            console.log("workshop", this.workshopDetails);
            console.log('Raw video URL:', this.workshopDetails.video_URL);
            fetch(this.workshopDetails.video_URL)
              .then(response => response.blob())
              .then(blob => {
                this.videoURL = URL.createObjectURL(blob);
                console.log('Blob video URL:', this.videoURL); // Check URL
              });
          },
          (error) => {
            console.error('Error fetching workshop details', error);
          }
        );
      }
    });
  
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }
  

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  prevSlide() {
    if (this.currentIndex === 0) {
      this.currentIndex = this.images.length - 1;
    } else {
      this.currentIndex--;
    }
  }

  nextSlide() {
    if (this.currentIndex === this.images.length - 1) {
      this.currentIndex = 0;
    } else {
      this.currentIndex++;
    }
  }
}