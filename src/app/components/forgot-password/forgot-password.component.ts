import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  forgotpassform: FormGroup = new FormGroup({});
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.forgotpassform = this.formBuilder.group({
      Username: [null, [Validators.required]],
      NewPassword: [null, [
        Validators.required,
        Validators.minLength(3)
      ]],
      ConfirmPassword: [null, Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const passwordControl = formGroup.get('NewPassword');
    const confirmPasswordControl = formGroup.get('ConfirmPassword');

    if (passwordControl && confirmPasswordControl) {
      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    }
  }

  onSubmit() {
    if (this.forgotpassform.invalid) {
      return;
    }
  
    const newPassword = this.forgotpassform.value.NewPassword;
    const confirmPassword = this.forgotpassform.value.ConfirmPassword;
  
    if (newPassword !== confirmPassword) {
      const confirmPasswordControl = this.forgotpassform.get('ConfirmPassword');
      if (confirmPasswordControl) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      }
      return;
    }
  
    this.authService.forgotPassword({
      Username: this.forgotpassform.value.Username,
      Email: this.forgotpassform.value.Email,
      NewPassword: newPassword
    }).subscribe(
      (response) => {
        console.log(response);
        alert("Password changed succefully successful!");
      },
      (error) => {
        console.log(error);
        this.error = error.message;
      }
    );
  }
  
  
}
