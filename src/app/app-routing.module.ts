import { BoardEquipmentComponent } from './components/board-equipment/board-equipment.component';
import { UserProfileComponent } from './UserManagement/user-profile/user-profile.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { SlidesComponent } from './components/slides/slides.component';
import { BoardFSComponent } from './components/board-fs/board-fs.component';
import { AboutComponent } from './components/about/about.component';
import { ShowmoreComponent } from './components/showmore/showmore.component';
import { VideotestComponent } from './components/videotest/videotest.component';
import { TestComponent } from './components/test/test.component';
import { ArticleComponent } from './components/Media/article/article.component';
import { UserManagementComponent } from './UserManagement/user-management/user-management.component';
import { ECEComponent } from './components/Media/ece/ece.component';
import { WorkshopComponent } from './components/Media/workshop/workshop.component';
import { UpdateProfileComponent } from './UserManagement/update-profile/update-profile.component';
import { EquipmentComponent } from './components/Media/equipment/equipment.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'slides',
    component: SlidesComponent
  },
  {
    path: 'boardfs',
    component: BoardFSComponent
  },
  {
    path: 'user-management',
    component: UserManagementComponent
  },
  {
    path: 'user-profile',
    component: UserProfileComponent
  },
  {
    path: 'update-profile',
    component: UpdateProfileComponent
  },
  {
    path: 'ECE',
    component: ECEComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'board-equipement',
    component: BoardEquipmentComponent
  },
  {
    path: 'showmore',
    component: ShowmoreComponent
  },
  {
    path: 'videotest',
    component: VideotestComponent
  },
  {
    path: 'test',
    component: TestComponent
  },
  {
    path: 'articles',
    component: ArticleComponent
  },
  {
    path: 'workshop',
    component: WorkshopComponent
  },
  {
    path: 'equipment',
    component: EquipmentComponent
  },
  {
    path: '', redirectTo: '/boardfs', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
