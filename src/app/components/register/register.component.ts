import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerData = {
    Fullname: '',
    Email: '',
    Username: '',
    Password: ''
  };

  constructor(private authService: AuthService) {}

  register(): void {
    this.authService.register(this.registerData).subscribe(
      response => {
        console.log(response); // Handle success response
      },
      error => {
        console.error(error); // Handle error response
      }
    );
  }

}
