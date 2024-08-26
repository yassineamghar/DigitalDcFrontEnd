import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{

  userId : string | undefined ; 
  fullName: string | null = null;
  error: string| null = null;
  items: MenuItem[] | undefined;

  constructor(public authService: AuthService, private routerlink:Router) {}  

  ngOnInit(): void {
    // this.loadFullName();
    // this.authService.isAuthenticated$.subscribe(isAuthenticated => {
    //   if (isAuthenticated) {
    //     this.loadFullName();
    //   } else {
    //     this.fullName = ''; // Clear full name when not authenticated
    //   }
    // });
    this.items = [
      {
          label: 'Options',
          items: [
              // {
              //     label: 'Refresh',
              //     icon: 'pi pi-refresh'
              // },
              {
                  label: 'Logout',
                  icon: 'pi pi-sign-out',
                  command: () => this.logout()
              }
          ]
      }
    ];
  }

  logout() {
    this.authService.logout();
    this.routerlink.navigate(['/boardfs']);
  }

  // loadFullName(): void {
  //   this.authService.getUserFullName(this.getCurrentUserId())
  //     .subscribe(
  //       (fullName) => {
  //         this.fullName = fullName;
  //       },
  //       (error) => {
  //         this.error = 'Error fetching user details';
  //         console.error(error);
  //       }
  //     );
  // }

}
