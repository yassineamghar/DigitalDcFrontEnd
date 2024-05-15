import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  forgotEmail: string = '';


  loginForm: FormGroup = new FormGroup({});
  error: string | null=null;
  
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      Username: [null, [Validators.required]],
      Password: [null, [
        Validators.required, 
        Validators.minLength(3)
      ]]
    })
  }
  
  onSubmit() {
    console.log(this.loginForm);
    if (this.loginForm.invalid) {
      return;
    }
    console.log(this.loginForm.value);
    this.authService.login(this.loginForm.value).subscribe(
      (response) => {
        console.log(response);
        alert("Login successful!");
        this.router.navigate(['home']);
      },
      (error) => {
        console.log(error);
        if (error.error && error.error.errors) {
          const errorMessages: string[] = [];
          for (const key in error.error.errors) {
            if (error.error.errors.hasOwnProperty(key)) {
              const messages = error.error.errors[key];
              errorMessages.push(...messages);
            }
          }
            this.error = errorMessages.join(' and ');
        } else {
          this.error = "Other error occurred.";
        }
      }
    );
  }

  ForgotPasswordSubmit() {
    this.authService.resetPassword(this.forgotEmail).subscribe(
      response => {
        if (response.status === 'Success') {
          this.router.navigate(['/forgotpassword']);
        } else {
          console.error('Error:', response.message);
        }
      },
      error => {
        console.error('Error:', error);
      }
    );
  }
  


}
