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
  showPage = false;
  
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient 
  ) { }

  ngOnInit(): void {
    const roles = this.authService.getUserRoles();
    this.showPage = roles.includes('admin');
    this.loginForm = this.formBuilder.group({
      Username: [null, [Validators.required]],
      Password: [null, [
        Validators.required,
        Validators.minLength(3)
      ]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
  
    this.authService.login(this.loginForm.value).subscribe(
      (response) => {
        if (response && response.token) {
          // Login successful
          alert("Login successful!");
          // Store the token in local storage
          localStorage.setItem('token', response.token);
  
          // Get user roles from the token
          const roles = this.authService.getUserRoles();
  
          // Check if roles contain 'admin'
          if (roles.includes('Admin')) {
            this.router.navigate(['user']);
          } else {
            this.router.navigate(['boardfs']);
          }
        } else {
          // Email not confirmed or other authentication error
          if (response && response.error === "Email not confirmed.") {
            alert("Email not confirmed.");
          } else {
            alert("Authentication failed: " + response.error);
          }
        }
      },
      (error) => {
        console.error(error);
        alert("Email not confirmed.");
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