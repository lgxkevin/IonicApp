import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ToastController } from '@ionic/angular';
import { GeneralService } from '../../app/service/general.service';
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
  checkList = [];
  logModel = {
    UserId: null,
    LogType: null,
    CreateAt: null
  };
  constructor(
    private geolocation: Geolocation,
    private route: ActivatedRoute,
    public toastController: ToastController,
    public generalService: GeneralService) {
    }

  ngOnInit() {
    this.route.params.subscribe(
      () => {
        this.pageName = this.route.snapshot.data.some_data;
      }
    );
    this.getTime().then( data => this.checkList = data);

    this.logModel.UserId = Storage.get({ key: 'userid' });
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
      }
      if (action === 'Out') {
        this.checkOutFilter(isPositionValid);
      }
    }

    checkInFilter(isPositionValid: boolean) {
      let lastCheckIn: string;
      this.logModel.LogType = 0;
      this.logModel.CreateAt = moment().toDate();
      if (isPositionValid) {
        this.checkInFeedback(1);
        // this.storeTime('checkIn', moment().format('MMMM Do YYYY, h:mm:ss a'));
        // successfully checkIn
        this.generalService.addLoginLog(this.logModel).subscribe(
          (res) => {
            console.log(res);
          }, (error) => {
            console.log(error);
          }
        );
      }
      if (!isPositionValid) {
        this.checkInFeedback(3);
      }
      // find the latest checkIn date and compare with the current time, if <1 day, case 5
      for (let i = this.checkList.length - 1; i >= 0; i--) {
        if (this.checkList[i].status === 'checkIn') {
          lastCheckIn = this.checkList[i].time;
          break;
        }
      }
      // if (lastCheckIn)
    }

    checkOutFilter(isPositionValid: boolean) {
      if (isPositionValid) {
        this.checkInFeedback(2);
        // successfully checkOut

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
  async storeTime(status: string, time: string) {
    this.getTime();
    const checkStatus = status;
    const checkTime = time;
    const item = {
      status: checkStatus,
      time: checkTime
    };
    this.checkList.push(item);
    await Storage.set({
      key: 'checkHistory',
      value: JSON.stringify(this.checkList)
    });
    }
  async getTime() {
    const ret = await Storage.get({ key: 'checkHistory' });
    const storageData = JSON.parse(ret.value);
    if (storageData) {
      return storageData;
    } else {
     return [];
    }
  }
}
