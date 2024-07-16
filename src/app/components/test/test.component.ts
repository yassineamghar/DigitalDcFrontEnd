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
    private userService: AuthService
  ) {
    this.userProfileForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], // Validators for email
      password: ['', Validators.minLength(8)], // Example validator for password minimum length
      confirmPassword: ['', this.confirmPasswordValidator], // Custom validator for matching confirmPassword with password
      confirmEmail: ['', this.confirmEmailValidator]  // Custom validator for matching confirmPassword with email
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
    const email = control.get('email');
    const confirmEmail = control.get('confirmEmail');

    if (email && confirmEmail && email.value !== confirmEmail.value) {
      return { 'emailMismatch': true };
    }

    return null;
  }

  ngOnInit(): void {
    // Fetch current user ID and then fetch user data
    this.userService.getCurrentUserId().subscribe((userId: string) => {
      this.userId = userId;
      this.userService.getUserById(userId).subscribe((user) => {
        this.userData = user.value; // Assuming 'value' contains the user data
        // Pre-fill the form with current user data
        this.userProfileForm.patchValue({
          fullname: this.userData.fullname,
          username: this.userData.userName, // Ensure correct mapping
          email: this.userData.email,
          confirmEmail: this.userData.email // Assuming confirmation email is the same as email
        });
      });
    });
  }

  onSubmit(): void {
    if (this.userProfileForm.valid) {
      const updatedUserData = {
        fullname: this.userProfileForm.value.fullname,
        username: this.userProfileForm.value.username,
        email: this.userProfileForm.value.email,
        password: this.userProfileForm.value.password // Include password if updating
      };

      console.log(updatedUserData);

      this.userService.updateUserProfile(this.userId, updatedUserData).subscribe(
        (response) => {
          console.log('Update User Response:', this.userId, updatedUserData);
          console.log('Profile updated successfully!');
          // Optionally, reset form or navigate to another page
        },
        (error) => {
          console.error('Error updating profile:', error);
          // Handle error messages or display to the user
        }
      );
    } else {
      console.log('Form is invalid. Please check all fields.');
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