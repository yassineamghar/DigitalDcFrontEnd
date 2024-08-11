import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {
  userProfileForm: FormGroup;
  userData: any; // Replace 'any' with your actual user data type
  userId: string = '';
  step = 1;
  showPassword: boolean = false;
  eyeIcon = faEye;
  eyeSlashIcon = faEyeSlash;

  constructor(
    private formBuilder: FormBuilder,
    private userService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.userProfileForm = this.formBuilder.group({
      Fullname: ['', Validators.required],
      UserName: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]], // Validators for email
      Password: ['', Validators.minLength(8)], // Example validator for password minimum length
      ConfirmPassword: ['', this.confirmPasswordValidator.bind(this)], // Custom validator for matching confirmPassword with password
      ConfirmEmail: ['', this.confirmEmailValidator.bind(this)] // Custom validator for matching confirmEmail with email
    });
  }

  // Custom validator function for matching passwords
  private confirmPasswordValidator(control: FormGroup): { [key: string]: any } | null {
    const password = this.userProfileForm?.get('Password')?.value;
    const confirmPassword = control.value;
    if (password && confirmPassword && password !== confirmPassword) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  // Custom validator function for matching emails
  private confirmEmailValidator(control: FormGroup): { [key: string]: any } | null {
    const email = this.userProfileForm?.get('Email')?.value;
    const confirmEmail = control.value;
    if (email && confirmEmail && email !== confirmEmail) {
      return { 'EmailMismatch': true };
    }
    return null;
  }

  ngOnInit(): void {
    this.userService.getCurrentUserId().subscribe((userId: string) => {
      this.userId = userId;
      this.userService.getUserById(userId).subscribe((user) => {
        this.userData = user.Value;
        this.userProfileForm.patchValue({
          Fullname: this.userData.Fullname,
          UserName: this.userData.UserName,
          Email: this.userData.Email,
          ConfirmEmail: this.userData.Email
        });
      });
    });
  }

  onSubmit(): void {
    if (this.userProfileForm.valid) {
      const password = this.userProfileForm.value.Password;
      const confirmPassword = this.userProfileForm.value.ConfirmPassword;
  
      // Check if passwords match if both are provided
      if (password && confirmPassword && password !== confirmPassword) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Passwords do not match.' });
        return;
      }
  
      // If ConfirmPassword is provided but Password is not, show error
      if (confirmPassword && !password) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Password is required when confirming.' });
        return;
      }
  
      const updatedUserData: any = {
        Fullname: this.userProfileForm.value.Fullname,
        username: this.userProfileForm.value.UserName,
        email: this.userProfileForm.value.Email
      };
  
      if (password) {
        updatedUserData.password = password;
      }
  
      this.userService.updateUserProfile(this.userId, updatedUserData).subscribe(
        (response: any) => {
          console.log('Update response:', response);
  
          // Handle undefined response or unexpected response structure
          if (response && response.success !== undefined) {
            if (response.success) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Profile updated successfully!' });
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Profile update failed.' });
            }
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Profile update failed. Please fill all the fields.' });
          }
        },
        (error) => {
          console.error('Error updating profile:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Profile update failed. Please try again later.' });
        }
      );
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Profile update failed. Please fill all the fields.' });
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

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  goToWorkshop() {
    this.router.navigate(['/user-profile']);
  }
}
