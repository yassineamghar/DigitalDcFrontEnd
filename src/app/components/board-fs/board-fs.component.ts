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
    

  ];
  ngOnInit() {
      
  }
  elem=document.documentElement;
  fullscreen(){
    if(this.elem.requestFullscreen){
      this.elem.requestFullscreen();
  }}
}