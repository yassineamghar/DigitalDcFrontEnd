import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import 'bootstrap';
// import jQuery from 'jquery';

// const $ = jQuery;
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  
  images_equ = [
    { name: '1.jpeg', title: 'Equipo 1', description: 'Descripcion del equipo 1' },
    { name: '2.jpeg', title: 'Equipo 2', description: 'Descripcion del equipo 2' },
    { name: '3.jpeg', title: 'Equipo 3', description: 'Descripcion del equipo 3' },
    { name: '4.jpeg', title: 'Equipo 4', description: 'Descripcion del equipo 4' },
    { name: '5.jpeg', title: 'Equipo 5', description: 'Descripcion del equipo 5' },
    { name: '6.jpeg', title: 'Equipo 6', description: 'Descripcion del equipo 6' },
  ];

  constructor() { }

  ngOnInit(): void {
    $(document).ready(() => {
      // Initialisation du carrousel
      (<any>$('#productCarousel')).carousel();
          ({
            interval: 3000
        });
    });
  }

  chunkArray(array: any[], size: number): any[][] {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
        array.slice(index * size, index * size + size)
    );
  }
}
