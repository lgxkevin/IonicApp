import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private baseUrl: any = environment.baseUrl;

  // hold the data fetched from the server
  data: string;
  broadcastData: string;

  messages = [];
  messageBody = {
    UserId: 3,
    MessageBody: 'Hi',
  };

  public hubConnection: signalR.HubConnection;
  constructor(private http: HttpClient) { }

  // build and start connection
  startConnection(name: string) {
    this.hubConnection = new signalR.HubConnectionBuilder()

      // add receiverId here
      // * userId MUST be string *

      .withUrl('http://localhost:5000/chat?userId=' + name)
      // .withUrl('http://45.76.123.59:5000/chat?userId=' + name)
      .build();
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));
  }
  // send data to our hub endpoint
  sendMessage(chatMessageModel) {
    // send message here

    this.hubConnection.invoke('SendMessageOneToOne', chatMessageModel)
    .catch((error) => console.log(error));

    // add message in database
    return this.http.post(this.baseUrl + 'Chat', chatMessageModel);
    // return this.http.post(this.baseUrl + 'Chat/TestMessage', chatMessageModel);
  }
  // listen on the SendMessage event
  listenMessage() {
    this.hubConnection.on('SendMessageOneToOne', (res) => {
      // const text = `${name}: ${message}`;
      // this.messages.push(text);
      console.log('New message', res);
    });
  }
}
