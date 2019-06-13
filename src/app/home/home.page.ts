import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import {GeneralService} from '../service/general.service';
import { Plugins } from '@capacitor/core';
import * as moment from 'moment';

const { Storage }  = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  username: string;
  password: string;
  isLoginSuccess: boolean;
  loginLog: any;
  checkInMessage: string;
  checkOutMessage: string;
  constructor(
    public toastController: ToastController,
    public generalService: GeneralService
  ) { }
  ngOnInit() {
    this.getUserId().then((data) => {
      if (data) {
        this.isLoginSuccess = true;
        this.generalService.getRecentLoginLog().subscribe( (res) => {
          this.loginLog = res['Data'];
          console.log(this.loginLog);
        }, (error) => {
          console.log(error);
        });
      }
    });
    this.checkNotice();
  }

  loginCheck() {
    const user = {
      username: this.username,
      password: this.password
    };
    console.log(`Username: ${this.username},password: ${this.password}`);
    this.generalService.userLogin(user).subscribe(
      (res) => {
        this.isLoginSuccess = true;
        this.presentToast('Login successfully');
        Storage.set({
          key: 'userId',
          value: JSON.stringify(res['Data'].userid)
        });
      }, (error) => {
        console.log(error);
        this.isLoginSuccess = false;
        this.presentToast('Login error');

      }
    );
  }
  async presentToast(message: string) {
    const feedbackMessage = message;
    let toastColor: string;
    if (feedbackMessage === 'Login successfully') {
      toastColor = 'success';
    } else {
      toastColor = 'danger';
    }
    const toast = await this.toastController.create({
      message: feedbackMessage,
      duration: 1500,
      color: toastColor
    });
    toast.present();
  }
  async getUserId() {
    const userId = await Storage.get({ key: 'userId' });
    if (userId) {
      return JSON.parse(userId.value);
    } else {
      return null;
    }
  }
  checkNotice() {
    // get check in detail
    this.generalService.getCheckDetail(0).subscribe((res) => {
      const lackCheckInTime = res['Data'].CreatedAt;
      this.checkInMessage = `Last check in at ${moment(lackCheckInTime).fromNow()}`;
    }, (error) => {
      console.log(error);
    });
    // get check out detail
    this.generalService.getCheckDetail(1).subscribe((res) => {
      const lackCheckOutTime = res['Data'].CreatedAt;
      this.checkOutMessage = `Checked out today at ${moment(lackCheckOutTime).fromNow()}`;
    }, (error) => {
      console.log(error);
    });

  }
  }
