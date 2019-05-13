import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';

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
    public toastController: ToastController
  ) {
  }

  loginCheck() {
    console.log(`Username: ${this.username},password: ${this.password}`);
    if (this.username === 'kevin' && this.password === 'qwer1234') {
      console.log('Login successfully');
      this.isLoginSuccess = true;
      this.presentToast('Login successfully');
    } else {
      console.log('Login error');
      this.isLoginSuccess = false;
      this.presentToast('Login error');
    }
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
      duration: 2000,
      color: toastColor
    });
    toast.present();
  }
}
