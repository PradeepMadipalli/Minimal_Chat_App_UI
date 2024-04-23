import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { Sendmessages } from '../model/registration.model';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  message: string;
  constructor() { }


  hubConnection: signalR.HubConnection;

  startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7288/chatHub', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();

    this.hubConnection
      .start()
      .then(() => {
      })
      .catch(err => console.log('Error while starting connection: ' + err))
  }


  sendMessage(message: Sendmessages): Promise<any> {
    console.log("saieswar");
    const jsonmessa = JSON.stringify(message);
    return this.hubConnection.invoke<any>("sendMessages",jsonmessa)
  }
  receiveMessage() {
    this.hubConnection.on('receiveMessage', (data) => {
      this.message = data;
      console.log(data);
    });

  }
}
