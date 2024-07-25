import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { Equipment } from 'src/app/models/Equipment/Equipment';
import { AuthService } from 'src/app/services/auth.service';
import { EquipmentService } from 'src/app/services/Equipment/equipment.service';

@Component({
  selector: 'app-board-equipment',
  templateUrl: './board-equipment.component.html',
  styleUrls: ['./board-equipment.component.css']
})
export class BoardEquipmentComponent implements OnInit{
  eq: Equipment[] = [];
  originalEq: Equipment[] = [];
  imageToShow: string | null = null;
  isImageDialogVisible = false;
  currentIndex: number = 0;
  intervalId: any;
  isAuthorized: boolean = false;


  constructor(public dialog: MatDialog, private eqService: EquipmentService, private messageService: MessageService,    private authService: AuthService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadEquipment();
    this.startInterval();
    this.isAuthorized = this.checkUserAuthorization();
    // Force change detection after updating isAuthorized
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  checkUserAuthorization(): boolean {
    const userRoles = this.authService.getUserRoles();
    const isAdminOrUser = userRoles.includes('Admin') || userRoles.includes('User');
    this.loadEquipment();
    return isAdminOrUser;

  }
  loadEquipment(): void {
    this.eqService.getAllEquipment().subscribe(
      (data) => {
        this.eq = data;
        this.originalEq = data;
        console.log('Equipments:', data);
      },
      (error) => {
        console.error('Error loading Equipment:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load Equipment. Please try again later.' });
      }
    );
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex === 0) ? (this.originalEq.length - 1) : (this.currentIndex - 1);
    this.resetInterval();
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex === this.originalEq.length - 1) ? 0 : (this.currentIndex + 1);
    this.resetInterval();
  }

  startInterval() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  resetInterval() {
    clearInterval(this.intervalId);
    this.startInterval();
  }
  
  formatTwoDigits(value: number): string {
    return value.toString().padStart(2, '0');
  }

  showImage(imageUrl: string): void {
    this.imageToShow = imageUrl;
    this.isImageDialogVisible = true;
  }

  hideImage(): void {
    console.log('Closing image dialog...');
    this.isImageDialogVisible = false;
  }

}