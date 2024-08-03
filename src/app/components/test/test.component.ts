// import { *aslightbox } from 'lightbox2';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import 'slick-carousel';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  providers: [MessageService],

})

export class TestComponent  implements OnInit {
  userProfileForm: FormGroup;
  userData: any; // Replace 'any' with your actual user data type
  userId: string = '';
  step = 1;

  constructor(
    private formBuilder: FormBuilder,
    private userService: AuthService,
    private messageService: MessageService,
  ) {
    this.userProfileForm = this.formBuilder.group({
      Fullname: ['', Validators.required],
      Username: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]], // Validators for email
      Password: ['', Validators.minLength(8)], // Example validator for password minimum length
      ConfirmPassword: ['', this.confirmPasswordValidator], // Custom validator for matching confirmPassword with password
      ConfirmEmail: ['', this.confirmEmailValidator]  // Custom validator for matching confirmPassword with email
    });
  }

  // Custom validator function for matching passwords
  private confirmPasswordValidator(control: FormGroup): { [key: string]: any } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  // Custom validator function for matching emails
  private confirmEmailValidator(control: FormGroup): { [key: string]: any } | null {
    const email = control.get('Email');
    const confirmEmail = control.get('ConfirmEmail');

    if (email && confirmEmail && email.value !== confirmEmail.value) {
      return { 'EmailMismatch': true };
    }

    return null;
  }

  ngOnInit(): void {
    this.userService.getCurrentUserId().subscribe((userId: string) => {
      this.userId = userId;
      this.userService.getUserById(userId).subscribe((user) => {
        this.userData = user.Value; 
        console.log(user.Value);
        this.userProfileForm.patchValue({
          Fullname: this.userData.Fullname,
          Username: this.userData.UserName, 
          Email: this.userData.Email,
          ConfirmEmail: this.userData.Email 
        });
      });
    });
  }

  onSubmit(): void {
    if (this.userProfileForm.valid) {
      const updatedUserData = {
        Fullname: this.userProfileForm.value.Fullname,
        username: this.userProfileForm.value.Username,
        email: this.userProfileForm.value.Email,
        password: this.userProfileForm.value.Password // Include password if updating
      };

      console.log(updatedUserData);

      this.userService.updateUserProfile(this.userId, updatedUserData).subscribe(
        (response) => {
          // console.log('Update User Response:', this.userId, updatedUserData);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Profile updated successfully!' });
          // Optionally, reset form or navigate to another page
        },
        (error) => {
          // console.error('Error updating profile:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error updating profile. Please try again later.' });

          // Handle error messages or display to the user
        }
      );
    } else {
      // console.log('Form is invalid. Please check all fields.');
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Form is invalid. Please check all fields.' });

    }
  }

  nextStep(): void {
    if (this.step < 3) {
      this.step++;
    }
  }

  prevStep(): void {
    if (this.step > 1) {
      this.step--;
    }
  }
}