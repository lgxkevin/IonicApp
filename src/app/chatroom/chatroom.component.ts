import { Component, OnInit } from '@angular/core';
import { ChatService } from '../service/chat.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router'


@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit {
  nick = '';
  message = '';
  messages = [];
  userId: number;
  constructor(
    public chatService: ChatService,
    private http: HttpClient,
    private route: ActivatedRoute
    ) { }

  ngOnInit() {
    this.route.params.subscribe( params => {
      this.userId = params['id'];
    });

    
    this.nick = window.prompt('Your name:', 'Emily');

    this.chatService.startConnection();
    // this.chatService.addTransferDataListener();
    // this.startHttpRequest();
    this.chatService.listenMessage();
  }

  // startHttpRequest() {
  //   this.http.get('http://localhost:5000/api/chat').subscribe(res => {
  //     console.log('res:', res);
  //   });
  // }

  chatClicked() {
    this.chatService.sendMessage(this.nick, this.message).subscribe((res) => {
      console.log(res);
    }, (error) => {
      console.log(error);
    });
    this.messages = this.chatService.messages;
  }

}
