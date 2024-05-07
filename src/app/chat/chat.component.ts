import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from '../services/config.service';
import { ConversationHistoryRequest, EditMessageRequest, RequestGroup, Sendmessages, repMessage } from '../model/registration.model';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { SignalrService } from '../services/signalr.service';
import { GroupService } from '../services/group.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent  {
uploadPhoto() {
throw new Error('Method not implemented.');
}
  @ViewChild('exampleModal') exampleModal: ElementRef;

  options = [
    { value: '1', label: 'One' },
    { value: '2', label: 'Two' },
    { value: '3', label: 'Three' },
    { value: '4', label: 'Four' },
    { value: '5', label: 'Five' },
    { value: '6', label: 'Six' },
    { value: '7', label: 'Seven' },
    { value: '8', label: 'Eight' },
  ];
  messages: any[] = [];
  messageid: string;
  newMessage: string = '';
  editIndex: number = -1;
  isEmojiPickerVisible: boolean;
  showButtons: boolean[] = [];
  users: any[];
  groups: any[];
  groupid: string;
  groupname: string;
  messagess: any[];
  responseData: any;
  mreceverid: string;
  groupchat: false;
  singlechat: false;
  mreceverusername: string;
  messageEnable: boolean = false;
  messageForm: FormGroup;
  GroupForm: FormGroup;
  sentmessages: Sendmessages;
  editmessages: EditMessageRequest;
  currentUser: string;
  sentGroupName: RequestGroup;
  currentusername: string;
  groupimage :string="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-8.webp"
  getconverstion: ConversationHistoryRequest;
  public textArea: string = '';
  connectedUsers$: any;
  constructor(private authService: UserService, private fb: FormBuilder, private confis: ConfigService, private toastr: ToastrService, private signalrService: SignalrService, private groupService: GroupService) {
    this.showButtons = new Array(this.messages.length).fill(false);
 

  }
  ngOnInit() {
    console.log(this.messageid);
    this.signalrService.startConnection();
    this.receiveMessage();
    

    this.getUser();

    this.messageForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(1)]]
    });
    this.GroupForm = this.fb.group({
      groupname: ['', [Validators.required, Validators.minLength(5)]]
    });
    this.currentUser = this.confis.getCuurectuserid();
  }
  createGroup() {
    console.log("Modal Success" + this.messageForm);
    this.sentGroupName = {
      GroupName: this.GroupForm.get('groupname').value,
      UserId: this.currentUser
    }
    this.groupService.creategroup(this.sentGroupName).subscribe(
      (response: any) => {
        this.closeModal();

      },
      (error) => {
        console.log(error);
        this.toastr.error('Error fetching data:', error);
      }
    );
    this.GroupForm.reset();
  }
  getUser() {
    this.authService.getUser().subscribe(
      (response: any) => {
        console.log(response);
        this.users = response.users;
        this.groups = response.groups;
        console.log(this.users);

      },
      (error) => {
        this.toastr.error('Error fetching data:', error);
      }
    );
  }
  receverclick(receverid: any, recerverusername: any) {
    console.log(receverid);
    this.mreceverid = receverid;
    this.mreceverusername = recerverusername;
    this.messageEnable = true;
    this.currentusername = this.getUsernameById(this.currentUser);

    this.getmessagess();
  }
  groupreceverclick(groupid: any, groupnamee: any) {
    console.log(groupid);
    this.groupid = groupid;
    this.mreceverid = "";
    this.groupname = groupnamee;
    this.messageEnable = true;
    this.currentusername = this.getUsernameById(this.currentUser);
    this.getmessagess();
  }
  sendMessage(): void {
    console.log(this.messageid);

    if (this.messageForm.valid) {
      this.sentmessages = {
        ReceiverId: this.mreceverid,
        Content: this.messageForm.get('message').value,
        SenderId: this.currentUser,
        groupId: this.groupid,
        GifImageId: 0,
        ThreadMessage: "",
        ShowOptions: 0
      

      }
      console.log(this.sentmessages)
      if (this.messageid == null) {

        console.log("")
        this.signalrService.sendMessage(this.sentmessages);
        this.messageForm.reset();
      }
      else {
        this.editmessages = {
          Messageid: this.messageid,
          Content: this.messageForm.get('message').value
        }
        this.authService.editMessage(this.editmessages).subscribe(

          response => {
            this.getmessagess();
            this.messageid = null;
            console.log('Message sent successfully:', response);
            this.messageForm.reset();
          },
          error => {
            this.toastr.error('Error sending message:', error);

          }
        );
      }


    }
  }
  getmessagess() {
    this.getconverstion = {
      UserId: this.mreceverid,
      Before: new Date(),
      Count: 30,
      Sort: 'desc',
      groupId: this.groupid

    }
    this.authService.GetConversationHistory(this.getconverstion).subscribe(

      response => {

        this.messagess = response.messages;
        console.log('Message sent successfully:', this.messagess);
        this.messageForm.reset();
      },
      error => {
        console.error('Error sending message:', error);
        this.messagess = null;
      }
    );
  }
  logout() {
    this.confis.logout();
  }
  sendMessage1() {
    if (this.newMessage.trim() === '') {
      return; // Ignore empty messages
    }
    this.messages.push({ sender: this.currentUser, receiver: 'Bob', content: this.newMessage });
    this.showButtons.push(false); // Push false to showButtons array for the new message
    this.newMessage = '';
  }
  receiveMessage() {
    this.signalrService.hubConnection.on('receiveMessage', (data) => {
      let myObject: any = JSON.parse(data);
      this.messagess.push(myObject);
      console.log(myObject);
    });
  }
  GroupCreated() {
    this.signalrService.hubConnection.on("GroupCreated", (data: any)=>{
      this.connectedUsers$.next(data);
    });
  }
  GroupNameUpdated() {
    this.signalrService.hubConnection.on("GroupNameUpdated", (data: any)=>{
      this.connectedUsers$.next(data);
    });
  }
  AddedToGroup(){
    this.signalrService.hubConnection.on("AddedToGroup", (data: any)=>{
      this.connectedUsers$.next(data);
    });
  }
  RemovedFromGroup(){
    this.signalrService.hubConnection.on("RemovedFromGroup", (data: any)=>{
      this.connectedUsers$.next(data);
    });
  }
  NewMessageAdded(){
    this.signalrService.hubConnection.on("NewMessageAdded", (data: any)=>{
      this.connectedUsers$.next(data);
    });
  }
  StatusUpdated(){
    this.signalrService.hubConnection.on("StatusUpdated", (data: any)=>{
      this.connectedUsers$.next(data);
    });
  }
  
  getUsernameById(id: string): string {
    const user = this.users.find(user => user.userId === id);
    console.log(user)
    return user ? user.userName : 'User not found';
  }
  editMessage(index: number) {
    this.editIndex = index;
    this.messageid = this.messagess[index].messageId;
    this.newMessage = this.messagess[index].content;
    console.log(this.messageid);
    this.messageForm.get('message').setValue(this.newMessage);
  }
  saveEdit() {
    if (this.editIndex !== -1) {
      this.messagess[this.editIndex].content = this.newMessage;
      this.newMessage = ''; // Clear the input field
      this.editIndex = -1;
    }
  }

  deleteMessage(index: number) {
    this.messagess.splice(index, 1);
    this.showButtons.splice(index, 1); // Remove corresponding item from showButtons array
  }

  toggleButtons(show: boolean, index: number) {
    this.showButtons[index] = show;
  }
  public addEmoji(event) {
    this.textArea = `${this.textArea}${event.emoji.native}`;
    this.isEmojiPickerVisible = false;
  }
  getTimeElapsed(messageTimestamp: Date): string {
    const now = new Date();
    const message = new Date(messageTimestamp);
    const differenceMs = now.getTime() - message.getTime();
    const minutes = Math.floor(differenceMs / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }
  closeModal() {
    const modalElement = this.exampleModal.nativeElement;
    modalElement.modal('hide');
  }
  showHistoryOptions(){
   
  }
  
}
