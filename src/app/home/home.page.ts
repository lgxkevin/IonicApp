import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  username: string;
  password: string;
  constructor() {
  }

  loginCheck() {
    console.log(`Username: ${this.username},password: ${this.password}`);
    if (this.username === 'kevin' && this.password === 'qwer1234') {
      console.log('Login successfully');
    } else {
      console.log('Login error');
    }
  }
}
