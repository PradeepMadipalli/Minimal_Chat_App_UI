import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { Group, Sendmessages, UserList } from '../model/registration.model';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  message: string;
  public messages$ = new BehaviorSubject<any>([]);
  public connectedUsers$ = new BehaviorSubject<string[]>([]);
  public messages: any[] = [];
  public users: string[] = [];
  constructor() {
    // this.hubConnection.on("ReceiveMessage", (user: string, message: string, messageTime: string)=>{
    //   this.messages = [...this.messages, {user, message, messageTime} ];
    //   this.messages$.next(this.messages);
    // });

    // this.hubConnection.on("ConnectedUser", (users: any)=>{
    //   this.connectedUsers$.next(users);
    // });
  }


  hubConnection: signalR.HubConnection;

  startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7288/chatHub', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();

    this.hubConnection
      .start()
      .then(() => {
      })
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  sendMessage(message: Sendmessages): Promise<any> {
    console.log("Pradeep");
    const jsonmessa = JSON.stringify(message);
    return this.hubConnection.invoke<any>("sendMessages", jsonmessa)
  }
  CreateGroup(groupName: string, userlist: string,userid:string) {
    return this.hubConnection.invoke<any>("CreateGroup", groupName, userlist,userid);
  }
  EditGroupName(groupId: number, newName: string) {
    return this.hubConnection.invoke<any>("EditGroupName", { groupId, newName });
  }
  AddGroupMember(groupId: string, memberId: string,userid:string) {
    return this.hubConnection.invoke<any>("AddGroupMember", groupId, memberId,userid);
  }
  RemoveGroupMember(groupId: string, memberId: string) {
    return this.hubConnection.invoke<any>("RemoveGroupMember", { groupId, memberId });
  }
  SendMessage(groupId: string, senderId: string, content: string) {
    return this.hubConnection.invoke<any>("SendMessage", { groupId, senderId, content });
  }
  SetStatus(userId: string, status: string) {
    return this.hubConnection.invoke<any>("SetStatus", { userId, status }).catch(error => {

    });
  }
  ShowHistoryOptions(groupId: string, memberId: string, option: string) {
    return this.hubConnection.invoke<any>("ShowHistoryOptions", { groupId, memberId, option })
      .catch(error => {
        console.error('Error sending data:', error);
      });
  }
  LeaveChat() {
    return this.hubConnection.stop();
  }
}
