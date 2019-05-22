import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import {GeneralService} from '../service/general.service';
import { Plugins } from '@capacitor/core';

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
  constructor(
    public toastController: ToastController,
    public generalService: GeneralService
  ) { }
  ngOnInit() {}

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
  }
