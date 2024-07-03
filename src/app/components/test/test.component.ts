// import { *aslightbox } from 'lightbox2';
import { Component, AfterViewInit, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import 'slick-carousel';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { NotificationService } from 'src/app/services/Notification/notification.service';
import { ECE } from 'src/app/models/Media/ECE';
import { EceService } from 'src/app/services/ECE/ece.service';
import { TestService } from 'src/app/services/Test/test.service';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
declare var $: any;
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  providers: [MessageService],
})
export class TestComponent{

}