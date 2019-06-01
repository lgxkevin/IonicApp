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
  awayDistance = 0;
  pageName: string;
  checkInHistory = [];
  checkOutHistory = [];
  checkList = [];
  logModel = {
    UserId: null,
    LogType: null,
    CreatedAt: null,
    OrgId: null
  };
  isPositionValid: boolean;
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
    this.getUserId().then( data => this.logModel.UserId = data);
    this.checkLocation(0, 0);
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

      // const isPositionValid = this.checkLocation(positionArray[0], positionArray[1]);
      if (action === 'In') {
        this.checkInFilter();
      }
      if (action === 'Out') {
        this.checkOutFilter();
      }
    }

    checkInFilter() {
      this.logModel.LogType = 0;
      this.logModel.CreatedAt = moment.utc().format();
      if (!this.isPositionValid) {
        this.checkInFeedback(3);
        return;
      }
      this.checkTimeFilter(0).then((result) => {
          // successfully checkIn
          this.generalService.addLoginLog(this.logModel).subscribe(
            (res) => {
              console.log(res);
              this.checkInFeedback(1);
            }, (error) => {
              console.log(error);
            }
          );
      }, (error) => {
        console.log(error);
      });
    }

    // find the latest checkIn date and compare with the current time, if <1 day, case 5

    // find the latest checkOut date and compare with the current time, if <1 day, case 6

     // find the latest check record and compare with the current time, if >1 day, case 7

     // todo: if try to check out in a different location

    //  *0: checkIn 1: checkOut 2: checkOut/checkIn
    checkTimeFilter(status: number): Promise<boolean> {
      return new Promise((resolve, reject) => {
        // get the last check in time
        if (status === 0 || status === 1) {
          this.generalService.getCheckDetail(status).subscribe(
            (res) => {
              console.log(res);
              const lackCheckInTime = res['Data'].CreatedAt;
              const diffTime = Math.abs( moment(lackCheckInTime).diff(moment.utc().format(), 'days', true));
              if (diffTime > 1) {
                resolve(true);
              }
              if (diffTime < 1) {
                status === 0 ? this.checkInFeedback(5) : this.checkInFeedback(6);
                reject('time error');
              }
            }, (error) => {
              reject(error);
          });
        }
        if (status === 2) {
          this.generalService.getCheckDetail(0).subscribe(
            (res) => {
              const lackCheckInTime = res['Data'].CreatedAt;
              const diffTime = Math.abs( moment(lackCheckInTime).diff(moment.utc().format(), 'days', true));
              if (diffTime < 1) {
                resolve(true);
              } else {
                reject();
              }
            }
          );
        }
      });
    }
    checkOutFilter() {
      this.logModel.LogType = 1;
      this.logModel.CreatedAt = moment.utc().format();
      if (!this.isPositionValid) {
        this.checkInFeedback(4);
        return;
      }
      // check case 7
      this.checkTimeFilter(2).then((result) => {
        // successful check
        // check case 6
        return this.checkTimeFilter(1);
        // failed check
      }, (error) => {
        this.checkInFeedback(7);
        throw new Error ('checkInFailed');
      }).then((result) => {
        this.generalService.addLoginLog(this.logModel).subscribe(
          (res) => {
            console.log(res);
            this.checkInFeedback(2);
          }, (error) => {
            console.log(error);
          }
        );
      }, (error) => {
        console.log(error);
      });

      // this.checkTimeFilter(1).then((result) => {
      //   if (isPositionValid && result) {
      //     // todo: add addLoginLog to a separate function
      //     this.generalService.addLoginLog(this.logModel).subscribe(
      //       (res) => {
      //         console.log(res);
      //         this.checkInFeedback(2);
      //       }, (error) => {
      //         console.log(error);
      //       }
      //     );
      //   }
      // }, (error) => {
      //   console.log(error);
      // });
    }

    // TODO always return true
    checkLocation(x, y) {
      this.generalService.getOrgs().subscribe(
        (res) => {
          res['Data'].forEach(element => {
            const orgX = element.localtion_x;
            const orgY = element.localtion_y;
            const R = 6371;
            const dx = (orgX - x) * Math.PI / 180 ;
            const dy = (orgY - y) * Math.PI / 180 ;
            const a = Math.sin(dx / 2) * Math.sin(dx / 2) +
            Math.cos(x * Math.PI / 180) * Math.cos(0 * Math.PI / 180) *
            Math.sin(dy / 2) * Math.sin(dy / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = R * c;
            this.awayDistance = distance * 1000;
            console.log(`${distance * 1000} metre`);
            if (this.awayDistance < 1500) {
              this.isPositionValid = true;
              this.logModel.OrgId = element.OrgId;
              console.log(`Successfully checked at ${element.OrgName}`);
              return;
            }}
          );
          this.isPositionValid = false;
        });
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
    async getUserId() {
      const ret = await Storage.get({ key: 'userId' });
      const storageData = JSON.parse(ret.value);
      if (storageData) {
        return storageData;
      } else {
      return null;
      }
    }
}
