import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
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
  error: string | null = null;
  showPassword: boolean = false;
  eyeIcon = faEye;
  eyeSlashIcon = faEyeSlash;
  
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient // Inject HttpClient
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      Username: [null, [Validators.required]],
      Password: [null, [
        Validators.required,
        Validators.minLength(3)
      ]]
    });
  }

  onSubmit() {
    // console.log(this.loginForm);
    if (this.loginForm.invalid) {
      return;
    }
    // console.log(this.loginForm.value);
    this.authService.login(this.loginForm.value).subscribe(
      (response) => {
        // console.log(response);
        alert("Login successful!");
        //store the token in local storage
        localStorage.setItem('token', response.token);
        this.router.navigate(['home']);
      },
      (error) => {
        // console.log(error);
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
    if (!this.forgotEmail) {
      alert('Please enter your email address.');
      return;
    }
    this.authService.forgotPassword(this.forgotEmail).subscribe(
      (response) => {
        // console.log(response);
        alert('Password reset link sent to your email.');
      },
      (error) => {
        // console.error(error);
        alert('Error sending password reset email.');
      }
    );
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}