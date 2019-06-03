import { Component, OnInit } from '@angular/core';
import { ChatService } from '../service/chat.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit {
  constructor(
    public chatService: ChatService,
    private http: HttpClient
    ) { }

  ngOnInit() {
    this.chatService.startConnection();
    this.chatService.addTransferDataListener();
    this.startHttpRequest();
    this.chatService.addBroadcastChatDataListener();
  }

  startHttpRequest() {
    this.http.get('http://localhost:5000/api/chat').subscribe(res => {
      console.log('res:', res);
    });
  }

  chatClicked(e) {
    console.log(e);
    this.chatService.broadcastChatData();
  }

}
