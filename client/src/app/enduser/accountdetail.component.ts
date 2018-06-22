//
import {Component,OnInit} from '@angular/core'
import {Router} from '@angular/router';
import { CommonService } from '../common.service';
import { SharedService } from '../shared.service';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

interface userDetail {
		_id?: string,
		admin: boolean,
		changedAt: string,
		changedBy: string, 
		createdAt: string, 
		createdBy: string, 
		currency: string, 
		deleted: boolean, 
		email: string, 
		email_verified: string, 
		gender: string, 
		login_password: string, 
		mobile: string, 
		mobile_verified: string,
		name: string,
		user_id: string,
		walletAmount: string
	}
@Component({
    //selector: 'app-root',
    templateUrl: './accountdetail.component.html',
   styleUrls: ['./accountdetail.component.css']
})
export class AppAccountDetail implements OnInit {
	router: Router;
	male: boolean;
	currencies: any = [];
	userDetail: userDetail;	
	disabledMode: boolean;
	showPasswordInfoDialog: boolean = false;
	
	constructor(private commonService: CommonService, private sharedService: SharedService, private http: Http, router: Router) { 
					this.router = router;
					var that = this;;
                    this.getJSON().subscribe(data => {
                                           that.currencies = data.currencies;
                     }, error => {
                                  console.log(error);
                     });
	}
	
	public getJSON(): Observable<any> {
                          return this.http.get("./assets/local.json")
                                   .map((res) => res.json())
                                   //.catch((error) => console.log(error));
    }
  
	ngOnInit() {
		var that = this;
		this.sharedService.sharedObj.containerContext.title = "Account";	
		this.disabledMode = true;
		this.sharedService.getUserProfile(function(user){
			that.userDetail = user;
			that.male = (that.userDetail.gender == "Male");
		});
		
		//this.commonService.getBrand("")
		//  .subscribe( brands => this.brands = brands.results);
	}
	
	getUserDetail(){
		this.commonService.getProfile(this.userDetail.user_id)
		  .subscribe( details => {
				if(details.length > 0)
					this.userDetail = details[0]
				else{
					alert("Unable to reload");
				}
			  });
	}
	
	onAccDetailEdit(){
		this.disabledMode = false;
	}
	
	onAccDetailSave(){
		if(this.validateEmail(this.userDetail.email)
			//&& this.validatePassword(this.userDetail.login_password)
		){
				this.userDetail.gender = (this.male)? "Male": "Female";
				this.commonService.updateProfile(this.userDetail)
				   .subscribe( data => {	
				   debugger;
					if(data.statusCode=="S"){
						this.disabledMode = true;
						this.getUserDetail();
					}
					else{
						alert("Unable to save");
					}		  
				  });
			}
	}
	
	validateEmail(email){
			var regx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
			if (regx.test(email)){ 
                return true; 
            } 
            alert("You have entered an invalid email address!") 
            return false; 
    }
								
	validatePassword(login_password){
           //Password should be atleast 8 characters long and should contain atleast one number,one character and one special character(among - @$!%*#?&)
           var regx = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/ ;
		   if (regx.test(login_password)){ 
                return true; 
           } 
           alert("You have entered an invalid password!") 
           return false; 
    }
	
	onMobileEnter(evt){
	   evt.target.value = (evt.target.value).replace(/[^0-9]/g, '');
	}
	
	passwordInfo(evt){
		this.showPasswordInfoDialog = true;
	}
	
	onPasswordChangeClick(){
		
	}
	
	onEditCancel(evt){
		this.disabledMode = true;
		this.getUserDetail();
	}
	
	
}
