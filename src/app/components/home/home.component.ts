import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  images=[
    {name: '1.avif', caption:""},
    {name: '2.jpeg', caption:""},
  ];
  // videos=[
  //   {name: '1.mp4', caption:""},
  // ]
}
