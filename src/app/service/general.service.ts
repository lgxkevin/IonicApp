import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  private baseUrl: any = environment.baseUrl;
  constructor(private http: HttpClient) { }

  userLogin(user) {
    return this.http.post(this.baseUrl + 'login', user);
  }
  getLoginLog() {
    return this.http.get(this.baseUrl + 'MobileLoginLogs');
  }
  getRecentLoginLog() {
    return this.http.get(this.baseUrl + 'MobileLoginLogs/GetRecentLoginLog');
  }
  getCheckDetail(status: number) {
    return this.http.get(this.baseUrl + 'MobileLoginLogs/GetLastCheck/' + status);
  }

  addLoginLog(log) {
    return this.http.post(this.baseUrl + 'MobileLoginLogs', log);
  }
  getOrgs() {
    return this.http.get(this.baseUrl + 'Orgs');
  }
}
