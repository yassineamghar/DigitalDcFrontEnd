// import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'; 
import { ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NgbModule, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from './components/footer/footer.component';
import { SlidesComponent } from './components/slides/slides.component';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { BoardFSComponent } from './components/board-fs/board-fs.component';
import { FootercarouselComponent } from './components/footercarousel/footercarousel.component';
import { BoardNewsComponent } from './components/board-news/board-news.component';
import { AboutComponent } from './components/about/about.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from 'primeng/carousel';
import { EquipementComponent } from './components/equipement/equipement.component';
import { VideotestComponent } from './components/videotest/videotest.component';
import { ShowmoreComponent } from './components/showmore/showmore.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TestComponent } from './components/test/test.component';
import { ArticleComponent } from './components/Media/article/article.component';
import { ImageComponent } from './components/Media/image/image.component';
import { VideoComponent } from './components/Media/video/video.component';
import { ArticleService } from './services/Articles/article.service';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { UserManagementComponent } from './UserManagement/user-management/user-management.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { JwtInterceptorService } from './services/JWT/jwt-interceptor.service';
import { ECEComponent } from './components/Media/ece/ece.component';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast'; 
import { NotificationService } from './services/Notification/notification.service';
import { MessageService } from 'primeng/api';
import { SplitterModule } from 'primeng/splitter';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ImageModule } from 'primeng/image';
import { UserProfileComponent } from './UserManagement/user-profile/user-profile.component';
import { MenuModule } from 'primeng/menu';
import { WorkshopComponent } from './components/Media/workshop/workshop.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { DialogComponent } from './Materials/dialog/dialog.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TreeTableModule } from 'primeng/treetable';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { StepsModule } from 'primeng/steps';
import { UpdateProfileComponent } from './UserManagement/update-profile/update-profile.component';
import { BoardEquipmentComponent } from './components/board-equipment/board-equipment.component';
import { EquipmentComponent } from './components/Media/equipment/equipment.component';
import { ImagePreviewComponent } from './Materials/image-preview/image-preview.component';
import { ReadMoreComponent } from './components/Media/read-more/read-more.component';
import { FileUploadModule } from 'primeng/fileupload';
import { SafePipe } from './Pipe/Safe/safe.pipe';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { CommingsoonComponent } from './components/CommingSoon/commingsoon/commingsoon.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ForgotPasswordComponent,
    NavbarComponent,
    FooterComponent,
    SlidesComponent,
    BoardFSComponent,
    FootercarouselComponent,
    BoardNewsComponent,
    AboutComponent,
    EquipementComponent,
    VideotestComponent,
    ShowmoreComponent,
    TestComponent,
    ArticleComponent,
    ImageComponent,
    VideoComponent,
    UserManagementComponent,
    SidebarComponent,
    ECEComponent,
    UserProfileComponent,
    WorkshopComponent,
    DialogComponent,
    UpdateProfileComponent,
    BoardEquipmentComponent,
    EquipmentComponent,
    ImagePreviewComponent,
    ReadMoreComponent,
    SafePipe,
    CommingsoonComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatInputModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule,
    NgbModule,
    NgbCarouselModule,
    MdbCarouselModule,
    CarouselModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NgxExtendedPdfViewerModule,
    MatSnackBarModule,
    MatDialogModule, 
    ButtonModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    SplitterModule,
    ToolbarModule,
    SplitButtonModule,
    ImageModule,
    MenuModule,
    NgxDocViewerModule,
    ProgressSpinnerModule,
    TreeTableModule,
    TableModule,
    DropdownModule,
    TagModule,
    StepsModule,
    FileUploadModule,
    ConfirmDialogModule,
  ],
  providers: [AuthService, ArticleService, NotificationService, MessageService,     ConfirmationService ],
  bootstrap: [AppComponent],
})
export class AppModule { }
