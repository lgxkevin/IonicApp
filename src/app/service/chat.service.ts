import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  // hold the data fetched from the server
  data: string;
  broadcastData: string;

  messages: string[] = [];

  public hubConnection: signalR.HubConnection;
  constructor() { }

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
    this.hubConnection.invoke('Broadcastchatdata', name, message )
    .catch((error) => console.log(error));
  }
  // listen on the broadcastchatdata event
  listenMessage() {
    this.hubConnection.on('Broadcastchatdata', (name: string, message: string) => {
      const text = `${name}: ${message}`;
      this.messages.push(text);
      console.log(this.messages);
    });
  }
}
