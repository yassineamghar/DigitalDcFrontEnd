import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { SlidesComponent } from './components/slides/slides.component';
import { BoardFSComponent } from './components/board-fs/board-fs.component';
import { BoardNewsComponent } from './components/board-news/board-news.component';
import { AboutComponent } from './components/about/about.component';
import { EquipementComponent } from './components/equipement/equipement.component';
import { ShowmoreComponent } from './components/showmore/showmore.component';
import { VideotestComponent } from './components/videotest/videotest.component';
import { TestComponent } from './components/test/test.component';
import { ArticleComponent } from './components/Media/article/article.component';

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
  // {
  //   path: 'boardfs',
  //   component: BoardFSComponent,
  //   children: [
  //     {
  //       path: 'about',
  //       component: AboutComponent
  //     },
  //     {
  //       path: 'equipement',
  //       component: EquipementComponent
  //     },
  //     {
  //       path: 'showmore',
  //       component: ShowmoreComponent
  //     },
  //     {
  //       path: 'videotest',
  //       component: VideotestComponent
  //     },
  //     {
  //       path: 'boardnews',
  //       component: BoardNewsComponent,
  //     }

  //   ]
  // },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'equipement',
    component: EquipementComponent
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
    path: '', redirectTo: '/boardfs', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
