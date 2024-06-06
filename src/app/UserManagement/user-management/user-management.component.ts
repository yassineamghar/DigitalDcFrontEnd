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
  selectedUser: User = new User('', '', '', '',new Date, false);
  isModalVisible: boolean = false;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(): void {
    this.authService.GetAll().subscribe(
      data => {
        this.users = data;
        console.log('Users retrieved successfully:', data);
      },
      error => {
        console.error('There was an error retrieving the users:', error);
      }
    );
  }

  selectUser(user: User): void {
    this.selectedUser = { ...user }; // Clone user to avoid direct binding
    this.isModalVisible = true;
  }

  updateUser(): void {
    this.authService.updateUser(this.selectedUser.id, this.selectedUser).subscribe(
      response => {
        console.log('User updated successfully:', response);
        this.isModalVisible = false;
        this.getAllUsers(); // Refresh the user list after updating
      },
      error => {
        console.error('There was an error updating the user:', error);
      }
    );
  }

  closeModal(): void {
    this.isModalVisible = false;
  }
}