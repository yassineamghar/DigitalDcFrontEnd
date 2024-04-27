import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  images=[
    {name: '1.avif', caption:"test"},
    {name: '2.jpeg', caption:"test"},
    {name: '3.htm', caption:"test"},
  ]
}
