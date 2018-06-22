import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { CommonService } from '../common.service';
//import { User } from '../user';
import { Http , Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

interface hidden {
  signup: boolean,
  profile: boolean
}

@Component ({
   selector: 'app-root',
   templateUrl: './signup.component.html',
   styleUrls: ['./signup.component.css'],
   providers: [CommonService] 
})
export   class   AppSignup  implements OnInit {
	//user: User;
	router: Router;
	hidden: hidden;
	//mobile:string;
	login_password:string = "";
	login_mobile:string = "";
	sendOTP: string = "";
	loginError: string = '';
	login_otp: string = '';
	
	newUser: any = {};
	user_id:string = "";
	//name: string = "";
	//email: string = "";
	male: boolean = true;
	//selectedCurrency: string = "";
	loginByPassword: boolean = true;
	//amount: string = "";

  constructor(private auth: AuthenticationService, private commonService: CommonService, router: Router) { 
		this.router = router;
  }

  ngOnInit() {
	  	 this.sendOTP = 'Send OTP'; 
		 this.hidden = {
			 signup: false,
			 profile: true
		 };
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
  
  onKeypress(evt){
	   this.loginError = "";
  }
  
  validatePassword(login_password){
           //Password should be atleast 8 characters long and should contain atleast one number,one character and one special character(among - @$!%*#?&)
           var regx = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/ ;
		   if (regx.test(login_password)){ 
                return true; 
           } 
           this.loginError = "You have entered an invalid password! \n ***Password should be atleast 8 characters long and should contain atleast one number,one character and one special character(among - @$!%*#?&)";
           return false; 
    }
	
	onMobileEnter(evt){
	   evt.target.value = (evt.target.value).replace(/[^0-9]/g, '');
	   this.onKeypress(evt);
	}
  
  onSubmit() {
	  if(!(this.validatePassword(this.login_password))){
		this.login_password = "";
		return false;  
	  }
	  
	  var that = this;	  
	  var login_mobile = this.login_mobile;
	  var login_password = this.login_password;
	  var login_otp = this.login_otp;
	  
	 if(login_mobile && login_otp && login_password){
				  /*this.commonService.loginByOtp(login_mobile,login_otp)
				   .subscribe( data => {	
					if(data[0] && data[0].mobile == login_mobile && data[0].otp == login_otp){*/
						var user = {
										user_id: "",
										admin: false,
										mobile: login_mobile,
										password: login_password,
										otp: login_otp
									};
						this.auth.register(user)
						   .subscribe( data => {	
						   //debugger;
							if(data.statusCode=="S"){
								that.hidden = {
									 signup: true,
									 profile: false
								 };
								 this.commonService.getProfile(data.results.user_id)
								   .subscribe( res => {
									   if(res.error){
										   alert("Unable to fetch profile");
									   }
									   else{
										 that.newUser = res.results[0];
									   }
								   });
							}
							else{
								if(data.msg)
									that.loginError = data.msg;
								else
									that.loginError = "Unable to sign up.";
							}		  
						  });
					/*}
					else{
						that.loginError = "Invalid OTP";
					}
				   });*/
	  }	  
	  else{
		  that.loginError =  "Please enter a valid credential.";
	  }
	  
  }
  
  gotoSignIn(){
	  this.router.navigateByUrl('/');
  }
  
  onUpdate() {
	  var that = this;
	  //that.newUser.name = that.name;
	  that.newUser.gender = (that.male)?'Male':'Female' ;
	  //that.newUser.email = that.email ;
	//that.newUser.login_password = login_password ;
	  //that.newUser.currency = that.selectedCurrency ;
	  //that.newUser.walletAmount = that.amount ;	
	  
	  if(that.newUser.name && that.newUser.email){
		  this.commonService.updateProfile(that.newUser)
		   .subscribe( data => {	
		   debugger;
			if(data.statusCode=="S"){
				that.router.navigateByUrl('/Container');
			}
			else{
				alert("Unable to update.");
			}		  
		  });
	  }
	  else{
		  alert("Please enter the required fields.");
	  }
	  
  }
  
  onUpdateCancel() {
	  this.router.navigateByUrl('/Container');
  }
  
  onEmailEnter(evt){
	  if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(evt.target.value))){ 
		evt.target.value = "";
	  }                                                 
  }

}