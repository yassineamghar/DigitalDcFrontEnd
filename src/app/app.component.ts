import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DigitalDCFront';
  showSidebar = false;

  constructor(private route: Router, private authService: AuthService){}

  ngOnInit() {
    const roles = this.authService.getUserRoles();
    this.showSidebar = roles.includes('user') || roles.includes('admin');
  }

  isAuthenticationRoute(): boolean {
    const authRoutes = ['/register', '/login', '/forgot-password'];
    return authRoutes.includes(this.route.url);
  }
}
