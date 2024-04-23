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
        this.error = error.error; 
      }
    );
  }
  


}
