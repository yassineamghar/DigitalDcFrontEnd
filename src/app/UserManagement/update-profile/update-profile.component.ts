import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {
  fullname: string='';
  username: string='';
  email: string='';
  status: string='';
  role!: string[];

  userData: any;

  constructor(private userService: AuthService) { }

  ngOnInit(): void {
    this.getCurrentUser();
  }

  getCurrentUser(): void {
    this.userService.getCurrentUserId().subscribe(
      (userId: string) => {
        this.userService.getUserById(userId).subscribe(
          (user) => {
            console.log(user);
            this.userData = user.value;

            this.fullname = this.userData.fullname;
            this.username = this.userData.userName;
            this.email = this.userData.email;
            this.role = this.userService.getUserRoles();
          },
          (error: any) => {
            console.error('Error fetching user:', error);
          }
        );
      },
      (error: any) => {
        console.error('Error fetching current user ID:', error);
      }
    );
  }
}
