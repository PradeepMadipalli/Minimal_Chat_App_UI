import { Injectable } from '@angular/core';
import { ConversationHistoryRequest, DeleteUserFromGroup, EditGroupName, EditMessageRequest, GroupUserRequest, Sendmessages, UpdateShowOptions } from '../model/registration.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from './config.service';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  showoption: UpdateShowOptions;
  private apiUrl: string;
  imageFileName:string;
  imageUpload:File;
  
  allowedExtension:any[] = ['image/jpeg', 'image/jpg', 'image/png','image/gif','image/bmp'];
  constructor(private http: HttpClient, private configService: ConfigService) {
    this.configService.getConfig().subscribe(config => {
      this.apiUrl = config.apiUrl;
     
    });
  }

  // uploadProfilePhoto(files: File) {
  //   this.imageUpload = files;
  //   this.imageFileName = this.imageUpload.name;
  //   var url:string="http://localhost:4200/assets/";
  //   // how to use FileSaver here ? 
  //    var require:any;
  //    console.log("before save");
  //   var FileSaver = require('file-saver');
  //   var data = new Blob([this.imageUpload], {type:"image/jpg"});
  //   FileSaver.saveAs(data, url+this.imageFileName); 
  //   console.log("after save"); 
  // }

  uploadProfilePhoto(file: File) :Observable<any>{
    const formData = new FormData();
    formData.append('photoFile', file,file.name);
  //   fetch('../assets/images' + file.name, {
  //     method: 'PUT',
  //     body: formData
  //   }).then(response => {
  //     if (response.ok) {
  //       console.log('File saved successfully.');
  //     } else {
  //       console.error('Failed to save file.');
  //     }
  //   }).catch(error => {
  //     console.error('Error occurred while saving file:', error);
  //   });
  // }
    return this.http.post<any>(`${this.apiUrl}/photo`, formData);
  }
  getUser(): Observable<any> {

    const httpOptionss = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',

        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      })
    };
    return this.http.get<any>(`${this.apiUrl}/users`, httpOptionss);
  }

  sendMessage(message: Sendmessages): Observable<any> {
    const httpOptionss = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    // const jsonString = JSON.stringify(message);
    // console.log(jsonString);
    return this.http.post(`${this.apiUrl}/send`, message, httpOptionss);
  }
  GetConversationHistory(message: ConversationHistoryRequest): Observable<any> {
    const httpOptionss = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    const jsonString = JSON.stringify(message);
    console.log(jsonString);
    return this.http.post(`${this.apiUrl}/Conversation`, message, httpOptionss);
  }
  editMessage(message: EditMessageRequest): Observable<any> {
    const httpOptionss = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post<any>(`${this.apiUrl}/EditMessage`, message, httpOptionss);
  }
  addGroupMember(groupId: string, memberId: string) {
    const httpOptionss = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post<any>(`${this.apiUrl}/EditMessage`, memberId, httpOptionss);
  }
  getusergroup(groupid: GroupUserRequest): Observable<any> {
    console.log("group");
    console.log(groupid);
    const httpOptionss = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post<any>(`${this.apiUrl}/GetuserGroups`, groupid, httpOptionss);
  }
  searchGIFs(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/search`);
  }
  showHistory(noofdays: string, messageId: string): Observable<any> {
    this.showoption = {
      noofdays: noofdays,
      messageId: messageId
    }
    console.log(this.showoption)
    return this.http.post<any>(`${this.apiUrl}/UpdateShowOption`, this.showoption);
  }
  deleteuserfromgroup(deleteusergroup:DeleteUserFromGroup):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/delete`,deleteusergroup);
  }
  editgroupMName(editGroupname:EditGroupName){
    return this.http.post<any>(`${this.apiUrl}/editgroupname`,editGroupname);
  }
}
