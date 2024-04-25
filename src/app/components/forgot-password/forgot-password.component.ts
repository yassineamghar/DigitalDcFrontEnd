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

  forgotpassform: FormGroup | any;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.forgotpassform = this.formBuilder.group({
      Username: [null, Validators.required],
      NewPassword: [null, [Validators.required, Validators.minLength(3)]],
      ConfirmPassword: [null, Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const passwordControl = formGroup.get('NewPassword');
    const confirmPasswordControl = formGroup.get('ConfirmPassword');

    if (passwordControl && confirmPasswordControl && passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ passwordMismatch: true });
    } else {
      confirmPasswordControl?.setErrors(null);
    }
  }

  onSubmit() {
    if (this.forgotpassform.invalid) {
      return;
    }

    const { Username, NewPassword } = this.forgotpassform.value;

    this.authService.forgotPassword({ Username, NewPassword }).subscribe(
      (response) => {
        console.log(response);
        alert("Password changed successfully!");
        this.router.navigate(['/login']);
      },
      (error) => {
        console.log(error);
        this.error = error.message;
      }
    );
  }
}
