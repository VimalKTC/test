import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { CommonService } from '../common.service';
import { SharedService } from '../shared.service';
import { User } from '../user';
import { Http , Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
declare var jQuery:any;

@Component ({
   selector: 'app-root',
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.css'],
   providers: [CommonService] 
})
export   class   AppLogin  implements OnInit {
	user: User;
	router: Router;
	mobile:string;
	login_password:string = "";
	login_mobile:string = "";
	login_otp:string = "";
	user_id:string = "";
	loginByPassword: boolean = true;
	loginByOTP: boolean = false;
	loginError: string = "";
	sendOTP: string = "Send OTP";

  constructor(private auth: AuthenticationService, private commonService: CommonService, private sharedService: SharedService, router: Router) { 
		this.router = router;
  }

  ngOnInit() {
	  	  
  }
  
  onLogin() {
	  this.sharedService.setBusy(true);
	  var that = this;
	  var login_mobile = this.login_mobile;
	  var login_password = this.login_password;
	  var login_otp = this.login_otp;
	  if(this.loginByPassword){
			  if(login_mobile && login_password){
				  var credential:any = {mobile:login_mobile, password:login_password};
				  this.auth.login(credential)
				   .subscribe( res => {
					if(res.token){
						var userDetail = that.auth.getUserDetails();
						that.commonService.getProfile(userDetail.user_id)
						   .subscribe( data => {							
								that.sharedService.sharedObj["userProfile"] = data.results[0];
								if(userDetail.admin == true){
									that.router.navigateByUrl('/ContainerAdmin');
								}
								else{
									that.router.navigateByUrl('/Container');
								}
						 });							
					}
					else{
						that.loginError = "Invalid credential.";
					}
					that.sharedService.setBusy(false);
				  });
			  }
			  else{
				  this.loginError = "Please enter your credential to login.";
				  this.sharedService.setBusy(false);
			  }
	  }
	  else{
			if(login_mobile && login_otp){
				  this.commonService.loginByOtp(login_mobile,login_otp)
				   .subscribe( res => {
					if(res.statusCode === "F"){
						if(res.msg)
							that.loginError = res.msg;
						else
							that.loginError = "Login failed";
						that.sharedService.setBusy(false);
					}
					else{
						var data = res.results;
						if(data[0] && data[0].mobile == login_mobile && data[0].otp == login_otp){
							var userDetail = that.auth.getUserDetails();
							this.commonService.getProfile(userDetail.user_id)
								.subscribe( result => {
									var users = result.results;
									//if(users.length > 0){
									that.sharedService.sharedObj["userProfile"] = users[0];
									if(userDetail.admin == true){
										that.router.navigateByUrl('/ContainerAdmin');
									}
									else{
										that.router.navigateByUrl('/Container');
									}	
									//}
									//else{
										//that.loginError = "Invalid Number.";
									//}
									that.sharedService.setBusy(false);
								});								
						}
						else{
							that.loginError = "Invalid credential.";
							that.sharedService.setBusy(false);
						}
					}					
				  });
			  }
			  else{
				  this.loginError = "Please enter your credential to login.";
				  this.sharedService.setBusy(false);
			  }
	  }
  }
  
  onSignup() {
	var that = this;
	var user_id = this.user_id;  	 
	that.router.navigateByUrl('/Signup');	  
  }
  onMobileEnter(evt){
	  this.onkeypress(evt);
	   evt.target.value = (evt.target.value).replace(/[^0-9]/g, '');
  }
  
  onkeypress(evt){
	  this.loginError = "";
	  if(evt.which === 13) {
         this.onLogin(); 
         evt.preventDefault();
      }
  }
  
  onSendOTP(){
	  this.loginError = "";
	  this.sendOTP = "Resend OTP";
	  if(this.login_mobile){
		  this.commonService.sendOtp(this.login_mobile)
			   .subscribe( data => {
			   
			  });	
	  }
	  else{
			this.loginError = "Please enter your mobile number.";
		}	  
  }

}