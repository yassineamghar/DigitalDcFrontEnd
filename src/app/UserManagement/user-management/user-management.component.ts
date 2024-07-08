import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { data } from 'jquery';
import { MessageService } from 'primeng/api';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  isAuthorized: boolean = false;
  itemToDelete: any;
  deleteDialogVisible: boolean = false;
  users: User[] = [];
  selectedUser: User = { id: '', fullname: '', username: '', email: '', dateCreated: new Date(), role: '', emailConfirmed: false };
  isModalVisible: boolean = false;
  UpdateDialogVisible: boolean = false;
  searchTerm: string = '';
  searchTermChanged: Subject<string> = new Subject<string>();


  constructor(
    private authService: AuthService, 
    private cdr: ChangeDetectorRef, 
    private messageService: MessageService
  ) {
    this.searchTermChanged.pipe(
      debounceTime(800), 
      distinctUntilChanged()
    ).subscribe(searchTerm => {
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
    const isAdminOrUser = userRoles.includes('Admin') || userRoles.includes('User');
    this.loadUsers();
    return isAdminOrUser;
  }

  loadUsers() {
    this.authService.GetAll().subscribe(data => {
      this.users = data;
      console.log(this.users);
    });
  }

  showDeleteDialog(item: any): void {
    this.itemToDelete = item;
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
    this.authService.updateUser(this.selectedUser.id, this.selectedUser).subscribe({
      next: () => {
        if (this.isModalVisible) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User updated successfully.' });
        }
        this.closeModal();
        this.loadUsers();
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error updating user!' });
        alert(error.error);
      }
    });
  }



  deleteUser() {
    if (this.itemToDelete) {
      this.authService.deleteUser(this.itemToDelete.userId).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'success', detail: 'User deletes successfully.' });
          this.loadUsers();
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error deleting user!!' });
          alert(error.error);
        }
      });
    }
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
    this.users = this.users.filter(item => item.fullname.toLowerCase().includes(this.searchTerm.toLowerCase()));
    if (this.users.length === 0) {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'No users found matching the search term.' });
    }
  } else {
    this.loadUsers();
    this.users = this.users;
  }
}

}