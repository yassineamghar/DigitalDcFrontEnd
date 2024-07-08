// import { *aslightbox } from 'lightbox2';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import 'slick-carousel';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  providers: [MessageService],

})

export class TestComponent  {
  step: number = 1;
  userProfileForm: FormGroup;

  constructor(private fb: FormBuilder, private messageService: MessageService) {
    this.userProfileForm = this.fb.group({
      fullname: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validator: this.emailMatchValidator });
  }

  emailMatchValidator(group: FormGroup) {
    const email = group.get('email')?.value;
    const confirmEmail = group.get('confirmEmail')?.value;
    return email === confirmEmail ? null : { emailMismatch: true };
  }

  nextStep() {
    if (this.step === 1 && this.userProfileForm.get('email')?.value !== this.userProfileForm.get('confirmEmail')?.value) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Emails do not match!' });
    } else if (this.step === 2 && this.userProfileForm.get('password')?.value !== this.userProfileForm.get('confirmPassword')?.value) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Passwords do not match!' });
    } else {
      this.step++;
    }
  }

  prevStep() {
    this.step--;
  }

  onSubmit() {
    if (this.userProfileForm.valid) {
      // Handle form submission
      console.log('Form Submitted', this.userProfileForm.value);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Profile updated successfully!' });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill out all required fields!' });
    }
  }
}