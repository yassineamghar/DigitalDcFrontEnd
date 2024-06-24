import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isActive: boolean = false;

  toggleSidebar() {
    this.isActive = !this.isActive;
  }

  showPage = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const roles = this.authService.getUserRoles();
    this.showPage = roles.includes('Admin');
  }
}
