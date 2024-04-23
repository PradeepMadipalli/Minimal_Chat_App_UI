import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from '../services/config.service';
import { ConversationHistoryRequest, EditMessageRequest, Sendmessages, repMessage } from '../model/registration.model';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { SignalrService } from '../services/signalr.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  messages: any[] = [];
  messageid: string;
  newMessage: string = '';
  editIndex: number = -1;
  isEmojiPickerVisible: boolean;
  showButtons: boolean[] = [];
  users: any[];
  messagess: any[];
  responseData: any;
  mreceverid: string;
  mreceverusername: string;
  messageEnable: boolean = false;
  messageForm: FormGroup;
  sentmessages: Sendmessages;
  editmessages: EditMessageRequest;
  currentUser: string;
  currentusername: string;
  getconverstion: ConversationHistoryRequest;
  public textArea: string = '';
  constructor(private authService: UserService, private fb: FormBuilder, private confis: ConfigService, private toastr: ToastrService, private signalrService: SignalrService) {
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
    this.currentUser = this.confis.getCuurectuserid();
  }
  getUser(){
    this.authService.getUser().subscribe(
      (response: any) => {

        this.users = response;
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
    this.getconverstion = {
      UserId: receverid,
      Before: new Date(),
      Count: 30,
      Sort: 'desc'

    }
    this.getmessagess();
  }
  sendMessage(): void {
    console.log(this.messageid);
    if (this.messageForm.valid) {
      this.sentmessages = {
        ReceiverId: this.mreceverid,
        Content: this.messageForm.get('message').value,
        SenderId: this.currentUser

      }
      if (this.messageid == null) {
        this.signalrService.sendMessage(this.sentmessages);

        // this.authService.sendMessage(this.sentmessages).subscribe(
        //   response => {
        //     this.getmessagess();
        //     this.toastr.success('Message sent successfully:', response);
        //     this.messageForm.reset(); 
        //   },

        //   error => {
        //     console.error('Error sending message:', error);

        //   }
        // );
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
      Sort: 'desc'

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
    this.signalrService.hubConnection.on('receiveMessage', (data) => {  // this.message=data;
      let myObject: any = JSON.parse(data);
      this.messagess.push(myObject);
      console.log(myObject);
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
}
