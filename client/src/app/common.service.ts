import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { Http, Headers } from '@angular/http';
import { User } from './user';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { map } from 'rxjs/operators/map';
import { SharedService } from './shared.service';
import { AdminService } from './admin.service';
import { EndUserService } from './enduser.service';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class CommonService {
	token: string = "";
  constructor(private auth: AuthenticationService, private http: HttpClient, private sharedService: SharedService, public adminService: AdminService, public enduserService: EndUserService) { 
	this.token = this.auth.getToken();
  }
  
  
  ///////////////////////////USERS/////////////////////////////
    
  /*checkUser(mobile,login_password){
	  return this.http.get('http://localhost:3000/api/users/?mobile='+mobile+'&login_password='+login_password)
	  .map((res: any) => {return res;});
  }*/
  
  /*login(credential){
	  return this.http.post('http://localhost:3000/api/login', credential)
	  .map(res => res.json());
  }
  
  addUser(newUser){
	  return this.http.post('http://localhost:3000/api/register', newUser)
	  .map(res => res.json());
  }*/
  
  getProfile(user_id){
	  return this.sharedService.call('profile/?user_id='+user_id, "get", null, true);
  }

  addProfile(userProfile){
	  return this.sharedService.call('profile', "post", userProfile, true);
  }
  
  updateProfile(userProfile){
	  return this.sharedService.call('profile', "put", userProfile, true);
  }
  
  
  sendOtp(mobile){
	  return this.sharedService.call('sendOTP/?mobile='+mobile, "get", null, true);
  }
  loginByOtp(mobile,login_otp){
	//return this.call('loginByOtp/?mobile='+mobile+'&otp='+login_otp, "get", null, true);
	let base = this.http.get('http://localhost:3000/api/loginByOtp/?mobile='+mobile+'&otp='+login_otp);
    
    const request = base.pipe(
      map((data: any) => {
        if (data && data.token) {
          this.auth.saveToken(data.token);
		  this.token = data.token;
        }
        return data;
      })
    );

    return request;
  }
  
    
}
