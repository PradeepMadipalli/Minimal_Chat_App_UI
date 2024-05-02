import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';
import { RequestGroup, UpdateStatus } from '../model/registration.model';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.configService.getConfig().subscribe(config => {
      this.apiUrl = config.apiUrl;
    });
  }

  creategroup(Groupname: RequestGroup): Observable<any> {
    console.log("creategroup")
    const httpOptionss = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post<any>(`${this.apiUrl}/creategroup`, Groupname, httpOptionss);
  }
  getStatus() {
    const httpOptionss = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.get<any>(`${this.apiUrl}/getStatus`);
  }
  updateStatus(status: UpdateStatus) {
    const httpOptionss = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post<any>(`${this.apiUrl}/updateStatus`, status, httpOptionss);
  }
  getCurrectStatus() {
    return this.http.get<any>(`${this.apiUrl}/GetCurrentstatus`);
  }
}
