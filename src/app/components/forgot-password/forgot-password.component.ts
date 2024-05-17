import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotpassform: FormGroup = new FormGroup({});
  error: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const token = this.getTokenFromUrl();
    this.forgotpassform = this.formBuilder.group({
      Username: [null, Validators.required],
      Email: [null, [Validators.required, Validators.email]],
      NewPassword: [null, [Validators.required, Validators.minLength(6)]],
      ConfirmPassword: [null, [Validators.required, Validators.minLength(6)]],
      Token: [token, Validators.required] // Add the token to the form group
    });
  }

  private getTokenFromUrl(): string {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('token') || '';
  }

  onSubmit(): void {
    if (this.forgotpassform.invalid) {
      return;
    }

    if (this.forgotpassform.value.NewPassword !== this.forgotpassform.value.ConfirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    const formData = {
      Username: this.forgotpassform.value.Username,
      Email: this.forgotpassform.value.Email,
      Password: this.forgotpassform.value.NewPassword, // Change NewPassword to Password
      ConfirmPassword: this.forgotpassform.value.ConfirmPassword,
      Token: this.forgotpassform.value.Token
    };

    this.authService.resetPassword(formData).subscribe(
      (response) => {
        console.log(response);
        alert('Password changed successfully!');
        this.router.navigate(['/login']);
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
          this.error = 'Other error occurred.';
        }
      }
    );
  }
}