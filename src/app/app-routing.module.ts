import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ChatroomComponent } from './chatroom/chatroom.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  // { path: 'menu', loadChildren: './menu/menu.module#MenuPageModule' },
  { path: 'checkIn', loadChildren: './check-in-and-out/check-in-and-out.module#CheckInAndOutPageModule', data : {some_data : 'checkIn'} },
  { path: 'checkOut', loadChildren: './check-in-and-out/check-in-and-out.module#CheckInAndOutPageModule', data : {some_data : 'checkOut'}},
  { path: 'chatroom', component: ChatroomComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
