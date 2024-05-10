import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-equipement',
  templateUrl: './equipement.component.html',
  styleUrls: ['./equipement.component.css']
})
export class EquipementComponent implements OnInit{
  
  images_equ=[
    { name: '1.jpeg', title: 'Equipo 1', description: 'Descripcion del equipo 1' },
    { name: '2.jpeg', title: 'Equipo 1', description: 'Descripcion del equipo 1' },
    { name: '3.jpeg', title: 'Equipo 1', description: 'Descripcion del equipo 1' },
    { name: '4.jpeg', title: 'Equipo 1', description: 'Descripcion del equipo 1' },
    { name: '5.jpeg', title: 'Equipo 1', description: 'Descripcion del equipo 1' },
    { name: '6.jpeg', title: 'Equipo 1', description: 'Descripcion del equipo 1' },

  ];

  constructor() { }

  ngOnInit(): void {
    this.startInterval();
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
