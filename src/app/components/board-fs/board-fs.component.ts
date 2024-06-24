import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-board-fs',
  templateUrl: './board-fs.component.html',
  styleUrls: ['./board-fs.component.css']
})
export class BoardFSComponent implements OnInit{
  isAuthorized: boolean = false;

  constructor(private cdr: ChangeDetectorRef, private authService:AuthService) { }

  ngOnInit(): void {
    this.isAuthorized = this.checkUserAuthorization();
    this.cdr.detectChanges(); 
}
checkUserAuthorization(): boolean {
  const userRoles = this.authService.getUserRoles();
  const isAdminOrUser = userRoles.includes('Admin') || userRoles.includes('User');
  return isAdminOrUser;
}

}