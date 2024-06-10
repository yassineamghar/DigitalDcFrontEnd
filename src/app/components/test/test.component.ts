import { ArticleService } from 'src/app/services/Articles/article.service';
import { Component, OnInit } from '@angular/core';
import 'slick-carousel';
import { Articles } from 'src/app/models/Media/Articles';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import * as pdfjsLib from 'pdfjs-dist';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NotificationService } from 'src/app/services/Notification/notification.service';
import { environment } from 'src/environments/environment';
import { DialogComponent } from 'src/app/Materials/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';



@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  users: User[] = [];


  // selectedUser: User = { id: '', fullname: '', userName: '', email: '', emailConfirmed: false, dateCreated: new Date() };
  isModalVisible: boolean = false;
  // selectedUser?: User;
  
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.authService.GetAll().subscribe(data => {
      this.users = data;
    });
  }

  selectUser(user: User) {
    // this.selectedUser = user;
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }
  toggleDropdown(users:any) {
    users.showDropdown = !users.showDropdown;
    users.showDropdown = false;
  }
  
  // updateUser() {
  //   this.authService.updateUser(this.selectedUser.id, this.selectedUser).subscribe({
  //     next: () => {
  //       alert('User updated successfully.');
  //       this.loadUsers();
  //       this.closeModal();
  //     },
  //     error: (error) => {
  //       alert(error.error);
  //     }
  //   });
  // }
  

  // deleteUser(userId: string) {
  //   if (confirm("Are you sure you want to delete this user?")) {
  //     console.log(userId);
  //     this.authService.deleteUser(userId).subscribe({
  //       next: () => {
  //         alert('User deleted successfully.');
  //         this.loadUsers(); 
  //       },
  //       error: (error) => {
  //         alert(error.error);
  //       }
  //     });
  //   }
  // }
}