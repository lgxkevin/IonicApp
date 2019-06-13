import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MenuPage } from '../app/menu/menu.page';
import { ChatroomComponent } from './chatroom/chatroom.component';

// services
import { GeneralService } from '../app/service/general.service';

@NgModule({
   declarations: [
      AppComponent,
      MenuPage,
      ChatroomComponent
   ],
   entryComponents: [],
   imports: [
      BrowserModule,
      IonicModule.forRoot(),
      AppRoutingModule,
      HttpClientModule,
      FormsModule
   ],
   providers: [
      StatusBar,
      SplashScreen,
      // provide
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule {}
