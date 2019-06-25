import { Component, OnInit } from '@angular/core';
import { ChatService } from '../service/chat.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Plugins } from '@capacitor/core';

const { Storage }  = Plugins;

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit {
  nick = '';
  message = '';
  messages = [];
  chatUserId: number;
  userId: number;
  chatGroupId: string;
  constructor(
    public chatService: ChatService,
    private http: HttpClient,
    private route: ActivatedRoute
    ) { }

  ngOnInit() {
    this.route.params.subscribe( params => {
      this.chatUserId = params['id'];
    });

    this.nick = window.prompt('Your name:', 'Emily');

    this.chatService.startConnection();
    // this.chatService.addTransferDataListener();
    // this.startHttpRequest();
    this.chatService.listenMessage();
  }

  async getUserId() {
    const userId = await Storage.get({ key: 'userId' });
    this.userId = JSON.parse(userId.value);
  }

  chatClicked() {
    this.chatService.sendMessage(this.nick, this.message).subscribe((res) => {
      console.log(res);
    }, (error) => {
      console.log(error);
    });
    this.messages = this.chatService.messages;
  }

}
