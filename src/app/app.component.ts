import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DigitalDCFront';

  constructor(private route: Router){}

  isAuthenticationRoute(): boolean {
    const authRoutes = ['/register', '/login', '/forgot-password'];
    return authRoutes.includes(this.route.url);
  }
}
