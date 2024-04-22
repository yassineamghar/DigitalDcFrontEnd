import { Component } from '@angular/core';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  public users: User[] = [];

  constructor(private authService: AuthService) {}

  register(): void {
    this.authService.register(this.users).subscribe(
      response => {
        console.log(response); // Handle success response
      },
      error => {
        console.error(error); // Handle error response
      }
    );
  }

}
