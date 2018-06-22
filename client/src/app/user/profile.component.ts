import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { CommonService } from '../common.service';
import { Http , Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component ({
   selector: 'app-root',
   templateUrl: './profile.component.html',
   styleUrls: ['./profile.component.css'],
   providers: [CommonService] 
})
export   class   AppUserProfile  implements OnInit {
	user: any = {};
	router: Router;
	//login_password:string;
	login_mobile: string;
	user_id:string = "";
	name: string = "";
	email: string = "";
	male: boolean = true;
	selectedCurrency: string = "";
	loginByPassword: boolean = true;
	amount: string = "";
	

  constructor(private commonService: CommonService, router: Router) { 
		this.router = router;
  }

  ngOnInit() {
	  	  
  }
  
  onUpdate() {
	  var that = this;
	  var user_id = this.user_id;
	  var login_mobile = this.login_mobile;
	  //var login_password = this.login_password;
	  
	  var userProfile = {
		user_id: "",
		mobile: login_mobile,
		name: that.name,
		gender: (that.male)?'Male':'Female',
		email: that.email,
		//login_password: login_password,
		currency: that.selectedCurrency,
		walletAmount: that.amount,
		mobile_verified: "",
		email_verified: "",
		deleted: false,
		createdBy: "",
		createdAt: "",
		changedBy: "",
		changedAt: ""
	};
	  
	  if(login_mobile){
		  this.commonService.updateProfile(userProfile)
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

}