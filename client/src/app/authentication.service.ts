import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { Router } from '@angular/router';


@Injectable()
export class AuthenticationService {
  token: string;

  constructor(private http: HttpClient, private router: Router) {}

  saveToken(token) {
    localStorage.setItem('mean-token', token);
    this.token = token;
  }

  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  getUserDetails() {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  isLoggedIn() {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  request(method, type, user) {
    let base;

    if (method === 'post') {
      base = this.http.post(`http://localhost:3000/api/${type}`, user);
    } else {
      base = this.http.get(`http://localhost:3000/api/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }});
    }

    const request = base.pipe(
      map((data: any) => {
        if (data && data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );

    return request;
  }

  public register(user: any): Observable<any> {
    return this.request('post', 'register', user);
  }

  public login(user: any): Observable<any> {
    return this.request('post', 'login', user);
  }


  logout() {
    this.token = '';
    window.localStorage.removeItem('mean-token');
    this.router.navigateByUrl('/');
  }
}