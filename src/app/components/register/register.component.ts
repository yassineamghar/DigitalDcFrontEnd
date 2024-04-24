import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup = new FormGroup({}); 
  error: string | null=null;

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
        Validators.minLength(6)
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
    console.log(this.registerForm.value);
    this.authService.register(this.registerForm.value).subscribe(
      (response) => {
        console.log(response);
        alert(response.message);
        this.router.navigate(['login']);
      },
      (error) => {
        console.log(error);
        this.error = error.error; 
      }
    );
    
  }

}
