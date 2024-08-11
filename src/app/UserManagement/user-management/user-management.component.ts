import {  ChangeDetectorRef,  Component,  ElementRef,  Input,  OnInit,  ViewChild,} from '@angular/core';
import { Router } from '@angular/router';
import { data } from 'jquery';
import { MessageService } from 'primeng/api';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  isAuthorized: boolean = false;
  itemToDelete: any;
  deleteDialogVisible: boolean = false;
  users: User[] = [];
  selectedUser: User = {
    Id: '',
    Fullname: '',
    UserName: '',
    Email: '',
    DateCreated: new Date(),
    Role: '',
    EmailConfirmed: false,
  };
  isModalVisible: boolean = false;
  UpdateDialogVisible: boolean = false;
  searchTerm: string = '';
  searchTermChanged: Subject<string> = new Subject<string>();

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService
  ) {
    this.searchTermChanged
      .pipe(debounceTime(800), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.searchTerm = searchTerm;
        this.filterUsers();
      });
  }

  @ViewChild('fileInput') fileInput!: ElementRef;

  ngOnInit() {
    this.loadUsers();
    this.isAuthorized = this.checkUserAuthorization();
    // Force change detection after updating isAuthorized
    this.cdr.detectChanges();
  }

  checkUserAuthorization(): boolean {
    const userRoles = this.authService.getUserRoles();
    const isAdminOrUser =
      userRoles.includes('Admin') || userRoles.includes('User');
    this.loadUsers();
    return isAdminOrUser;
  }

  loadUsers() {
    this.authService.GetAll().subscribe((data) => {
      this.users = data;
      // console.log(this.users);
    });
  }

  showDeleteDialog(user: any) {
    this.selectedUser = user;
    this.deleteDialogVisible = true;
  }

  selectUser(user: User) {
    this.selectedUser = user;
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
    this.loadUsers();
  }

  toggleDropdown(users: any) {
    users.showDropdown = !users.showDropdown;
    users.showDropdown = false;
  }

  updateUser() {
    this.authService
      .updateUser(this.selectedUser.Id, this.selectedUser)
      .subscribe({
        next: () => {
          if (this.isModalVisible) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'User updated successfully.',
            });
          }
          this.closeModal();
          this.loadUsers();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error updating user!',
          });
          alert(error.error);
        },
      });
  }

  deleteUser(userId: string) {
    if (userId) {
      this.authService.deleteUser(userId).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User deleted successfully.',
          });
          this.loadUsers();
          this.deleteDialogVisible = false;
        },
        error: (error) => {
          // console.error('Delete user error:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error deleting user!',
          });
        },
      });
    } else {
      console.error('User ID is missing');
    }
  }

  confirmDelete(user: User) {
    this.itemToDelete = user;
    this.deleteDialogVisible = true;
  }

  getSeverity(role: string): string {
    switch (role) {
      case 'Admin':
        return 'success';
      case 'User':
        return 'info';
      default:
        return 'secondary';
    }
  }

  filterUsers(): void {
    if (this.searchTerm) {
      this.users = this.users.filter((item) =>
        item.Fullname.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      if (this.users.length === 0) {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'No users found matching the search term.',
        });
      }
    } else {
      this.loadUsers();
      this.users = this.users;
    }
  }
}
