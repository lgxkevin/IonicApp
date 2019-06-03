import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  // hold the data fetched from the server
  data: string;
  broadcastData: string;
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
  addTransferDataListener() {
    this.hubConnection.on('Transferchatdata', (data) => {
      this.data = data;
      console.log('data:', data);
    });
  }
  // send data to our hub endpoint
  broadcastChatData() {
    this.hubConnection.invoke('Broadcastchatdata', this.data)
    .catch((error) => console.log(error));
  }
  // listen on the broadcastchatdata event
  addBroadcastChatDataListener() {
    this.hubConnection.on('Broadcastchatdata', (data) => {
      this.broadcastData = data;
    });
  }
}
