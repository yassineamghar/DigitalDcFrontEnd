import { Component } from '@angular/core';

@Component({
  selector: 'app-footercarousel',
  templateUrl: './footercarousel.component.html',
  styleUrls: ['./footercarousel.component.css']
})
export class FootercarouselComponent {
  activeIndex: number | null = null;

  toggleActive(index: number) {
    this.activeIndex = index;
  }
}
