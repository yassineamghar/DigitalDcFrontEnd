import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { WorkshopService } from 'src/app/services/Workshop/workshop.service';

@Component({
  selector: 'app-read-more',
  templateUrl: './read-more.component.html',
  styleUrls: ['./read-more.component.css']
})
export class ReadMoreComponent implements OnInit, OnDestroy {
  @Input() workshopDetails: any;
  currentIndex = 0;
  intervalId: any;
  videoURL: SafeResourceUrl | undefined;

  constructor(private route: ActivatedRoute, private wsService: WorkshopService, private sanitizer: DomSanitizer, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.wsService.getWorkshopById(id).subscribe(
          (workshop) => {
            this.workshopDetails = workshop;
            this.videoURL = this.sanitizer.bypassSecurityTrustResourceUrl(workshop.video_URL);
            console.log("workshop", this.workshopDetails);
            console.log("videoURL", this.videoURL);
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
    if (this.currentIndex === this.workshopDetails.image_URL.length - 1) {
      this.currentIndex = 0;
    } else {
      this.currentIndex++;
    }
  }

  nextSlide() {
    if (this.currentIndex === 0) {
      this.currentIndex = this.workshopDetails.image_URL.length - 1;
    } else {
      this.currentIndex--;
    }
  }

  goToWorkshop() {
    this.router.navigate(['/workshop']);
  }
}