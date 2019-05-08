import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { async } from 'q';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  location: string;
  checkInPlace = [-36.9135302, 174.8724183];
  constructor(private geolocation: Geolocation) {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition((res) => {
  //       const x = res.coords.latitude;
  //       const y = res.coords.longitude;
  //       this.location = `Latitude is ${x}, Altitude is ${y}`;
  //     }, (error) => {
  //       this.location = 'Cannot detect current position';
  //     },{ timeout: 30000, enableHighAccuracy: true });
  //     console.log('Position is changing.');
  // } else {
  //     alert('Your browser does not support the Geolocation API!');
  // }
  }
  async checkIn() {
  // const positionArray = this.getLocation();
    let positionArray = [];
    await this.geolocation.getCurrentPosition().then((res) => {
      const x = res.coords.latitude;
      positionArray.push(x);
      const y = res.coords.longitude;
      positionArray.push(y);
    }).catch((error) => {
      console.log(error);
    });

    if (this.checkLocation(positionArray[0], positionArray[1])) {
      console.log('CheckInSuccess');
    } else {
      console.log('CheckInFailed');
    }
  }

  // getLocation() {
  //   const position = [];
  //   this.geolocation.getCurrentPosition().then((res) => {
  //     const x = res.coords.latitude;
  //     position.push(x);
  //     const y = res.coords.longitude;
  //     position.push(y);
  //     console.log('position:', position);
  //     return position;
  //   }).catch((error) => {
  //     position.push(error);
  //     return position;
  //   });
  // }

  checkLocation(x, y): boolean {
    const R = 6371;
    const dx = (this.checkInPlace[0] - x) * Math.PI / 180 ;
    const dy = (this.checkInPlace[1] - y) * Math.PI / 180 ;
    const a = Math.sin(dx / 2) * Math.sin(dx / 2) +
    Math.cos(x * Math.PI / 180) * Math.cos(this.checkInPlace[0] * Math.PI / 180) *
    Math.sin(dy / 2) * Math.sin(dy / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    console.log(distance);
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
