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
  }

  public hubConnection: signalR.HubConnection;
  constructor(private http: HttpClient) { }

  // build and start connection
  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5000/chat')
      .build();
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));
  }
  // subscribe to the event Transferchatdata and accept data from the server with the data parameter
  // addTransferDataListener() {
  //   this.hubConnection.on('Transferchatdata', (data) => {
  //     this.data = data;
  //     console.log('data:', data);
  //   });
  // }
  // send data to our hub endpoint
  sendMessage(name: string, message: string) {
    this.hubConnection.invoke('SendMessage', name, message )
    .catch((error) => console.log(error));
    this.messageBody.MessageBody = message;
    this.messageBody.UserId = 3;
    return this.http.post(this.baseUrl + 'Chat', this.messageBody);
  }
  // listen on the SendMessage event
  listenMessage() {
    this.hubConnection.on('SendMessage', (name: string, message: string) => {
      const text = `${name}: ${message}`;
      this.messages.push(text);
      console.log(this.messages);
    });
  }
  // sendMessage(name:string, message: string) {
  //   this.messageBody.Name = name;
  //   this.messageBody.Message = message;
  //   console.log(this.messageBody);
  //   return this.http.post(this.baseUrl + 'Chat', this.messageBody);
  // }

}
