import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { map } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({}); 
  error: string | null = null;
  showPassword: boolean = false;
  eyeIcon = faEye;
  eyeSlashIcon = faEyeSlash;


  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      Fullname: [null, [Validators.required]],
      Username: [null, [Validators.required]],
      Email: [null, [
        Validators.required,
        Validators.email,
      ]],
      Password: [null, [
        Validators.required,
        Validators.minLength(3)
      ]]
      
    });
  }

  onSubmit(){
    if(this.registerForm.invalid) {
      return;
    }
    const role = 'user';
    console.log(this.registerForm.value);
    this.authService.register(this.registerForm.value, role).subscribe(
      (response) => {
        console.log(response);
        alert(response.message);
        this.router.navigate(['login']);
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

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

}
