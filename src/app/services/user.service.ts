import { Injectable } from '@angular/core';
import { ConversationHistoryRequest, EditMessageRequest, Sendmessages } from '../model/registration.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl: string;
  constructor(private http: HttpClient, private configService: ConfigService) {
    this.configService.getConfig().subscribe(config => {
      this.apiUrl = config.apiUrl;
    });
  }

  getUser(): Observable<any> {

    const httpOptionss = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',

        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      })
    };
    return this.http.get<any>(`${this.apiUrl}/users`, httpOptionss); // Adjust the API endpoint as needed
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
    // const jsonString = JSON.stringify(message);
    // console.log(jsonString);
    return this.http.post<any>(`${this.apiUrl}/EditMessage`, message, httpOptionss);
  }
}
