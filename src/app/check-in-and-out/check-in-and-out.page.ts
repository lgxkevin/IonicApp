import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ActivatedRoute } from '@angular/router';

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

  constructor(
    private geolocation: Geolocation,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(
      () => {
        this.pageName = this.route.snapshot.data.some_data;
      }
    );
  }

  async checkIn() {
    // const positionArray = this.getLocation();
      const positionArray = [];
      await this.geolocation.getCurrentPosition({enableHighAccuracy: true}).then((res) => {
        const x = res.coords.latitude;
        positionArray.push(x);
        const y = res.coords.longitude;
        positionArray.push(y);
        const acc = res.coords.accuracy;
        console.log('acc: ', acc);
      }).catch((error) => {
        console.log(error);
      });

      if (this.checkLocation(positionArray[0], positionArray[1])) {
        console.log('CheckInSuccess');
      } else {
        console.log('CheckInFailed');
      }
    }

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
      // TODO : determine whether checkIn is successfully
      return true;
      // if (xDistance === 0 && yDistance === 0) {
      //   return true;
      // }
      // const radiusDistance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
      // console.log('radiusDistance, ', radiusDistance);
      // if (radiusDistance < 100) {
      //   return true;
      // } else {
      //   return false;
      // }
    }

}
