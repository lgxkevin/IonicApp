import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';


import { IonicModule } from '@ionic/angular';

import { CheckInAndOutPage } from './check-in-and-out.page';

const routes: Routes = [
  {
    path: '',
    component: CheckInAndOutPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CheckInAndOutPage],
  providers: [
    Geolocation
  ]
})
export class CheckInAndOutPageModule {}
