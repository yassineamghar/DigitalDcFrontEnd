import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  isAuthorized: boolean = false;
  user: User = {
    Id: '',
    Fullname: '',
    UserName: '',
    Email: '',
    DateCreated: new Date(),
    Role: '',
    EmailConfirmed: false,
  };
  roles: string[] = [];
    
  constructor(
    private authService: AuthService, 
    private cdr: ChangeDetectorRef, 
    private route: ActivatedRoute,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.authService.getCurrentUserId().subscribe(
      (userId: string) => {
        if (userId) {
          this.authService.getUserById(userId).subscribe(
            (user) => {
              this.user = user.Value;
              this.roles = this.authService.getUserRoles();
              console.log(this.roles);
            },
            (error) => {
              console.error('Error fetching user data:', error);
            }
          );
        } else {
          console.error('No userId returned from getCurrentUserId');
        }
      },
      (error) => {
        console.error('Error fetching current user ID:', error);
      }
    );
    this.isAuthorized = this.checkUserAuthorization();
    this.cdr.detectChanges();
  }


  checkUserAuthorization(): boolean {
    const userRoles = this.authService.getUserRoles();
    const isAdminOrUser = userRoles.includes('Admin') || userRoles.includes('User');
    return isAdminOrUser;
  }

 

}
