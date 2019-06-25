import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';
import { GeneralService } from '../../app/service/general.service';


const { Storage }  = Plugins;

@Component({
  selector: 'app-chatWith',
  templateUrl: './chatWith.component.html',
  styleUrls: ['./chatWith.component.css']
})
export class ChatWithComponent implements OnInit {

  userDetail = {
    userId: null,
    role: null
  };
  peopleOnline: any;
  constructor(
    private route: Router,
    public generalService: GeneralService
    ) { }

  ngOnInit() {
    let userId: number;
    let role: string;
    this.getUserDetail().then(data => {
        this.getChattingList();
    });
  }

  async getUserDetail() {
    const role = await Storage.get({ key: 'role' });
    this.userDetail.role = JSON.parse(role.value);

    const userId = await Storage.get({ key: 'userId' });
    this.userDetail.userId = JSON.parse(userId.value);
  }

  getChattingList() {
    if (this.userDetail.role === 'learner') {
      this.generalService.getTeachers(this.userDetail.userId).subscribe((res) => {
        console.log(res);
        this.peopleOnline = res['Data'];
      });
    }
    if (this.userDetail.role === 'teacher'){
      this.generalService.getStudents(this.userDetail.userId).subscribe((res) => {
        console.log(res);
        this.peopleOnline = res['Data'];

    });
    }
  }

}
