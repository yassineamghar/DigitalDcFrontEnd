// import { *aslightbox } from 'lightbox2';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import 'slick-carousel';
import { MessageService } from 'primeng/api';
import { TreeNode } from 'pdf-lib/cjs/core/structures/PDFPageTree';
import { TreeTableModule } from 'primeng/treetable';
import { CommonModule } from '@angular/common';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

declare var $: any;


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  providers: [MessageService],

})


export class TestComponent  implements OnInit {
  isAuthorized: boolean = false;
  itemToDelete: any;
  deleteDialogVisible: boolean = false;
  users: User[] = [];
  selectedUser: User = { id: '', fullname: '', username: '', email: '', dateCreated: new Date(),role:'', emailConfirmed: false, };
  isModalVisible: boolean = false;
  // selectedUser?: User;

  constructor(private authService: AuthService, private cdr: ChangeDetectorRef,     private messageService: MessageService  ) { }

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
  }
  toggleDropdown(users:any) {
    users.showDropdown = !users.showDropdown;
    users.showDropdown = false;
  }
  
  updateUser() {
    this.authService.updateUser(this.selectedUser.id, this.selectedUser).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'success', detail: 'User updated successfully.' });
        this.loadUsers();
        this.closeModal();
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error updating user!!' });
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
  }}
}