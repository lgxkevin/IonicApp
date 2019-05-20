import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ToastController } from '@ionic/angular';
import * as moment from 'moment';

const { Storage }  = Plugins;

@Component({
  selector: 'app-check-in-and-out',
  templateUrl: './check-in-and-out.page.html',
  styleUrls: ['./check-in-and-out.page.scss'],
})
export class CheckInAndOutPage implements OnInit {
  location: string;
  checkInPlace = [-36.9135302, 174.8724183];
  awayDistance = 0;
  pageName: string;
  checkInHistory = [];
  checkOutHistory = [];
  currentTime: string;
  constructor(
    private geolocation: Geolocation,
    private route: ActivatedRoute,
    public toastController: ToastController) {
    }

  ngOnInit() {
    this.route.params.subscribe(
      () => {
        this.pageName = this.route.snapshot.data.some_data;
      }
    );
    this.currentTime = moment().format('dddd, MMMM Do YYYY');
  }

  async checkMain(action: string) {
      const positionArray = [];
      // Get current user position
      await this.geolocation.getCurrentPosition({enableHighAccuracy: true}).then((res) => {
        positionArray.push(res.coords.latitude);
        positionArray.push(res.coords.longitude);
        const acc = res.coords.accuracy;
        console.log('acc: ', acc);
      }).catch((error) => {
        console.log(error);
      });

      const isPositionValid = this.checkLocation(positionArray[0], positionArray[1]);
      if (action === 'In') {
        this.checkInFilter(isPositionValid);
        // this.checkInHistory.push(`Check in at ${moment().format('MMMM Do YYYY, h:mm:ss a')}`);
      }
      if (action === 'Out') {
        this.checkOutFilter(isPositionValid);
      }
    }

    checkInFilter(isPositionValid) {
      if (isPositionValid) {
        this.checkInFeedback(1);
      }
      if (!isPositionValid) {
        this.checkInFeedback(3);
      }
      // find the latest checkIn date and compare with the current time, if <1 day, case 5
    }

    checkOutFilter(isPositionValid) {
      if (isPositionValid) {
        this.checkInFeedback(2);
      }
      if (!isPositionValid) {
        this.checkInFeedback(4);
      }
      // find the latest checkOut date and compare with the current time, if <1 day, case 6

      // find the latest check record and compare with the current time, if >1 day, case 7

    }

    // TODO always return true
    checkLocation(x, y): boolean {
      const R = 6371;
      const dx = (this.checkInPlace[0] - x) * Math.PI / 180 ;
      const dy = (this.checkInPlace[1] - y) * Math.PI / 180 ;
      const a = Math.sin(dx / 2) * Math.sin(dx / 2) +
      Math.cos(x * Math.PI / 180) * Math.cos(this.checkInPlace[0] * Math.PI / 180) *
      Math.sin(dy / 2) * Math.sin(dy / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      this.awayDistance = distance * 1000;
      console.log(`${distance * 1000} metre`);
      return true;
      // if (this.awayDistance === 0) {
      //   return true;
      // }
      // if (this.awayDistance < 300) {
      //   return true;
      // } else {
      //   return false;
      // }
    }

    feedbackMessage(status: number): string {
      switch (status) {
        case 1: {
          return 'Check in successfully';
        }
        case 2: {
          return 'Check out successfully';
        }
        case 3: {
          return 'Check in failed. You are out of location.';
        }
        case 4: {
          return 'Check out failed. You are out of location.';
        }
        case 5: {
          return 'You have already checked in.';
        }
        case 6: {
          return 'You have already checked out.';
        }
        case 7: {
          return 'Please Check in before you check out';
        }
      }
    }

    async checkInFeedback(status: number) {
      const feedbackMessage = this.feedbackMessage(status);
      let toastColor: string;
      if (status === 1 || status === 2) {
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

    deleteCheckInHistory(i: number) {
      console.log('i', i);
      this.checkInHistory.splice(i, 1);
    }
    deleteCheckOutHistory(i: number) {
      console.log('i', i);
      this.checkOutHistory.splice(i, 1);
    }

  // set check time in storage
  // status: checkIn/checkOut; time: checkIn/checkOut time
  async storeTime(status: string, time) {
      const checkStatus = status;
      const checkTime = time;
      await Storage.set({
        key: 'checkHistory',
        value: JSON.stringify({
          status: checkStatus,
          time: checkTime
        })
      });
      this.getTime();
    }
  async getTime() {
    const ret = await Storage.get({ key: 'user' });
    const user = JSON.parse(ret.value);
    console.log(user);
  }
}
