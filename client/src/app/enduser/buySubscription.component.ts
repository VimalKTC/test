//
import {Component,OnInit,Input} from '@angular/core';
import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Router} from '@angular/router';
import { CommonService } from '../common.service';
import { SharedService } from '../shared.service';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
declare var jQuery:any;

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
      selector: 'buy-subscription',
      templateUrl: './buySubscription.component.html',
      styleUrls: ['./buySubscription.component.css']
})

@Injectable()

export class AppBuySubscription implements OnInit {
		item: any;
		hidden: any;
		disabled: any;
		userDetail: userDetail;
		plans: any;
		@Input() buyItem;
		@Input() parentComponent;

      constructor(private router: Router, private http: Http, private commonService: CommonService, private sharedService: SharedService) {
                                          
	  }
     

      ngOnInit(){
		var that = this;
		this.item = {};
        this.hidden = {view: false, add: true};
        this.disabled = {field: false};
		this.plans = [{}];
		this.sharedService.getUserProfile(function(user){	
			that.userDetail = user;
			that.commonService.adminService.getSubscription("",that.buyItem.app_name)
				.subscribe( subscriptions => that.plans = subscriptions.results); 
		});
		
      }
	
	load(app_name){
		this.plans = [{}];
		this.commonService.adminService.getSubscription("",app_name)
			.subscribe( subscriptions => this.plans = subscriptions.results); 
	}
	
      onCancel(evt){
             this.parentComponent.onSubSaveCancel("");
      }
	
	onBuy(evt,plan){
		debugger;
		var item = jQuery.extend({},plan,this.buyItem);
		item.amt_paid = plan.amount;
		item.deleted = false;
		item.createdBy = this.userDetail.user_id;
		item.changedBy = this.userDetail.user_id;
		this.addSubscription(item);
	}
	
	addSubscription(item){
		this.commonService.enduserService.addSubscription(item)
			   .subscribe( data => {	
			   debugger;
				if(data.statusCode=="S"){
						//this.onAddressSaveCancel("");
						//this.commonService.enduserService.getSubscription(this.userDetail.user_id,"")
							//.subscribe( result => this.subscriptions = result.subscription);
					this.onCancel("");
				}
				else{
					alert("Unable to save");
				}		  
		});
	}


}
