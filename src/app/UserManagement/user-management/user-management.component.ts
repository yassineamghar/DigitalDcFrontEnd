import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { data } from 'jquery';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  selectedUser: User = { id: '', fullname: '', username: '', email: '', dateCreated: new Date(),role:'', emailConfirmed: false, };
  isModalVisible: boolean = false;
  // selectedUser?: User;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.authService.GetAll().subscribe(data => {
      this.users = data;
      console.log(this.users);
    });
  }

  selectUser(user: User) {
    this.selectedUser = user;
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }
  toggleDropdown(users:any) {
    users.showDropdown = !users.showDropdown;
    users.showDropdown = false;
  }
  
  updateUser() {
    this.authService.updateUser(this.selectedUser.id, this.selectedUser).subscribe({
      next: () => {
        alert('User updated successfully.');
        this.loadUsers();
        this.closeModal();
      },
      error: (error) => {
        alert(error.error);
      }
    });
  }
  

  deleteUser(userId: string) {
    if (confirm("Are you sure you want to delete this user?")) {
      console.log(userId);
      this.authService.deleteUser(userId).subscribe({
        next: () => {
          alert('User deleted successfully.');
          this.loadUsers(); 
        },
        error: (error) => {
          alert(error.error);
        }
      });
    }
  }
}