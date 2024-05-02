import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from '../services/config.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';
import { AddUserList, ConversationHistoryRequest, EditMessageRequest, Group, GroupUserRequest, ProfilePhoto, RequestGroup, Sendmessages, UpdateStatus, UserList } from '../model/registration.model';
import { SignalrService } from '../services/signalr.service';
import { GroupService } from '../services/group.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-chat-real',
  templateUrl: './chat-real.component.html',
  styleUrl: './chat-real.component.scss'
})
export class ChatRealComponent implements OnInit {
  @ViewChild('exampleModal') exampleModal: ElementRef;
  @ViewChild('AddMember') AddMember: any;
  Group = new Subject<any>();
  messages: any[] = [];
  messageid: string;
  newMessage: string = '';
  editIndex: number = -1;
  isEmojiPickerVisible: boolean;
  showButtons: boolean[] = [];
  users: any[];
  userofgroups: any[];
  groups: any[];
  SelectedStatus: number;
  userlistcount: number = 0;
  groupid: string;
  myClasscolBind: boolean = false;
  groupname: string;
  messagess: any[] = [];
  filteredMessages:any[]=[];
  responseData: any;
  mreceverid: string;
  groupchat: false;
  singlechat: false;
  mreceverusername: string;
  messageEnable: boolean = false;
  messageForm: FormGroup;
  GroupForm: FormGroup;
  messageVis: boolean = false;
  MemberForm: FormGroup;
  sentmessages: Sendmessages;
  editmessages: EditMessageRequest;
  currentUser: string;
  sendCurrentStatus: UpdateStatus;
  sentGroupName: RequestGroup;
  currentusername: string;
  getconverstion: ConversationHistoryRequest;
  getMessages:any[];
  searchQuery: string = '';
  public textArea: string = '';
  connectedUsers$: any;
  selectedFile: File;
  uploadedPhotoUrl: string;
  profilePhotoModel: ProfilePhoto;
  dropdownList = [];
  selectedItems = [];
  groupofuserlist: any[];
  dropdownSettings: IDropdownSettings = {};
  getStatuss: any[];
  currectStatus: number;
  isFindModalOpen: boolean = false;
  groupPanel: boolean;
  ProfilePanel: boolean;
  AddGroupMembertime: Date;
  groupUserRequest: GroupUserRequest;
  imagephoto: string = 'https://i.pinimg.com/originals/cc/b0/95/ccb0956f1d63cab069840c18224e9001.png';
  userlist: any[] = [];
  addUserList: AddUserList[] = [];
  addUsermember: boolean = false;
  userGrouplister: string = '[{\"userId\":\"a89660c1-fab3-42c7-ac58-e3ec0888378f\",\"userName\":\"RameshWaltair\",\"isDisabled\":false}]';
  addmembertogroup: string;
  constructor(private authService: UserService, private fb: FormBuilder,
    private confis: ConfigService, private toastr: ToastrService,
    private signalrService: SignalrService, private groupService: GroupService, private changeDetectorRef: ChangeDetectorRef) {
    this.showButtons = new Array(this.messages.length).fill(false);


  }
  ngOnInit() {
    console.log(this.messageid);
    this.signalrService.startConnection();
    var values = JSON.parse(this.userGrouplister);
    console.log(values + " testing");
    this.receiveMessage();
    this.NewGroupCreated();
    this.getUser();
    this.getAddGroupMember();
    this.getStatusss();
    this.getCurrectStatusss();
    this.uploadedPhotoUrl;
    this.messageForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(1)]]
    });
    this.GroupForm = this.fb.group({
      groupname: ['', [Validators.required, Validators.minLength(5)]]
    });
    this.currentUser = this.confis.getCuurectuserid();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'userId',
      textField: 'userName',
      enableCheckAll: false,
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

  }
  cleanString(str) {
    str = str.replace('"[', '[');
    str = str.replace(']"', ']');
    return str;
  }

  NewGroupCreated() {
    this.signalrService.hubConnection.on("GroupCreated", (data) => {
      let myObject: any = JSON.parse(data);
      this.groups.push(myObject);
    });
  }
  createGroup() {
    console.log("Modal Success" + this.messageForm);
    this.sentGroupName = {
      GroupName: this.GroupForm.get('groupname').value,
      UserId: this.currentUser
    }
    this.signalrService.CreateGroup(this.GroupForm.get('groupname').value, JSON.stringify(this.userlist))
    this.closeModal();
    this.GroupForm.reset();
  }
  getUser() {
    this.authService.getUser().subscribe(
      (response: any) => {
        console.log(response);
        this.users = response.users;

        // sessionStorage.setItem('users',this.users);
        this.groups = response.getGroups;
        console.log(this.users);


      },
      (error) => {
        this.toastr.error('Error fetching data:', error);
      }
    );
  }
  receverclick(receverid: any, recerverusername: any) {
    this.addUsermember = false;
    console.log("revere");
    this.mreceverid = receverid;
    this.mreceverusername = recerverusername;
    this.messageEnable = true;
    this.groupid = "";
    this.currentusername = this.getUsernameById(this.currentUser);
    this.getmessagess();
    this.filteredMessages = [];
  }
  groupreceverclick(groupid: any, groupnamee: any) {
    this.addUsermember = false;
    console.log(groupid);
    this.groupid = groupid;
    this.mreceverid = "";
    this.groupname = groupnamee;
    this.messageEnable = true;
    this.currentusername = this.getUsernameById(this.currentUser);
    this.getmessagess();
    this.getuserGroup();
    this.filteredMessages = [];

  }
  getuserGroup() {
    console.log("test group");
    this.groupUserRequest = {
      groupId: this.groupid
    }
    this.authService.getusergroup(this.groupUserRequest).subscribe(data => {
      console.log(data);
      console.log(data.length);
      this.userlistcount = data.length;
      this.groupofuserlist = data;
    }, error => {

    }
    );

  }

  sendMessage(): void {
    console.log(this.messageid);

    if (this.messageForm.valid) {
      this.sentmessages = {
        ReceiverId: this.mreceverid,
        Content: this.messageForm.get('message').value,
        SenderId: this.currentUser,
        groupId: this.groupid

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
  openFileSelection() {
    document.getElementById('fileInput').click();
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.uploadPhoto();
  }
  uploadPhoto() {
    console.log("upload");
    if (this.selectedFile) {
      this.authService.uploadProfilePhoto(this.selectedFile,)
        .subscribe(photoUrl => {
          console.log('Photo uploaded successfully:', photoUrl);

          this.uploadedPhotoUrl = photoUrl;
        },
          error => {
            console.error('Upload error', error);
          });

    }
  }
  getmessagess() {
    this.messagess = null;
    this.getconverstion = {
      UserId: this.mreceverid,
      Before: new Date(),
      Count: 30,
      Sort: 'desc',
      groupId: this.groupid

    }
    this.authService.GetConversationHistory(this.getconverstion).subscribe(

      response => {
        this.messagess = response.messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
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

  SetStatus() {
    this.signalrService.hubConnection.on("GetUpdateUserStatus", (data: any) => {
      this.connectedUsers$.next(data);
    });
  }
  GroupNameUpdated() {
    this.signalrService.hubConnection.on("GroupNameUpdated", (data: any) => {
      this.connectedUsers$.next(data);
    });
  }
  AddedToGroup() {
    this.signalrService.hubConnection.on("AddedToGroup", (data: any) => {
      this.connectedUsers$.next(data);
    });
  }
  RemovedFromGroup() {
    this.signalrService.hubConnection.on("RemovedFromGroup", (data: any) => {
      this.connectedUsers$.next(data);
    });
  }
  NewMessageAdded() {
    this.signalrService.hubConnection.on("NewMessageAdded", (data: any) => {
      this.connectedUsers$.next(data);
    });
  }
  StatusUpdated() {
    this.signalrService.hubConnection.on("StatusUpdated", (data: any) => {
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
  addEmoji(event) {
    this.textArea = `${this.textArea}${event.emoji.native}`;
    this.isEmojiPickerVisible = false;
  }
  getTimeElapsed(messageTimestamp: Date): string {
    const now = new Date();

    const message = new Date(messageTimestamp);
    message.setHours(message.getHours() + 5);
    message.setMinutes(message.getMinutes() + 30);
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
    //this.exampleModal.nativeElement.click();
  }
  showHistoryOptions() {

  }
  Getusergroupname(senderId: any) {
    return this.users.find(u => u.userId === senderId).userName;
  }
  onItemSelect(item: any) {
    this.userlist.push(item);
  }
  onAddItemDeSelect(item: any) {
    this.addUserList.pop();
  }
  onItemDeSelect(item: any) {
    this.userlist.pop();
  }
  onAddItemSelect(item: any) {
    this.addUserList.push(item);
  }
  AddGroupMember() {

    this.signalrService.AddGroupMember(this.groupid, JSON.stringify(this.addUserList))
  }
  isdisableuser() {
    this.userofgroups = null;
    this.selectedItems = null;
    console.log("userdisable");
    console.log(this.userofgroups);
    // this.users.forEach((item, i) => {
    //   if (this.groupofuserlist.some(u => u.userId === item.userId)) {
    //     this.users[i].isDisabled = true;
    //   }
    //   else {
    //     this.users[i].isDisabled = false;
    //   }
    // });
    // console.log(this.users);
    this.userofgroups = this.users
  }
  getAddGroupMember() {
    this.signalrService.hubConnection.on('AddedToGroupMember', (data: any) => {
      let myObject: any = JSON.parse(data);

      var username = "";
      var newmber = "";
      this.addUsermember = true;
      myObject.userGrouplist.forEach(item => {

        if (myObject.userGrouplist.length == 1) {

          username = item.UserName;
          newmber = " new group member add to Group";
        } else {

          username = username + " " + item.UserName + ","
          newmber = " new group member's add to Group";
        }
      });

      this.addmembertogroup = username + newmber;
      this.AddGroupMembertime = new Date();
    });
  }
  getStatusss() {
    this.groupService.getStatus().subscribe((data) => {

      this.getStatuss = data;
      console.log(this.getStatuss);
    }

    )
  }
  getCurrectStatusss() {
    this.groupService.getCurrectStatus().subscribe((data) => {
      console.log(data);
      this.currectStatus = data;

    }
    )
    // updateUserStatus(){
    //   this.StatusUpdated=
    // }
  }

  onSelectStatusChange() {
    this.sendCurrentStatus = {
      status: this.SelectedStatus
    }
    this.groupService.updateStatus(this.sendCurrentStatus).subscribe((data) => {
      this.getCurrectStatusss();
    }

    )
  }

  myClassBinding() {

  }
  showTooltip() {
    console.log("controlF")
    this.myClasscolBind = !this.myClasscolBind;
    this.messageVis=!this.messageVis;
  }
  searchMessages(){
    this.filteredMessages = null;
    console.log("Called Munde");
    if (!this.searchQuery.trim()) {
      this.filteredMessages = [];
      return;
    }
    this.filteredMessages = this.messagess.filter(message =>
      message.content.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    console.log("Called");
  }
}
