import {Component,OnInit, ViewChild} from '@angular/core';
import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Router} from '@angular/router';
import { CommonService } from '../common.service';
import { SharedService } from '../shared.service';
import { AppBuySubscription } from './buySubscription.component';
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
           //selector: 'app-root',
           templateUrl: './subscription.component.html',
           styleUrls: ['./subscription.component.css']
})

@Injectable()
export class AppSubscription implements OnInit {
        subscriptions: any;                        
        item: any;
        hidden: any;
        disabled: any;
		userDetail: userDetail; 		
		showApplicationListDialog: boolean = false;
		applications: any;
		buyItem: any = {};
		self: any = this;
		
		@ViewChild(AppBuySubscription) buyComponent: AppBuySubscription;
		
          constructor(private router: Router, private http: Http, private commonService: CommonService, private sharedService: SharedService) {
                this.router = router;                   
          } 
                
          ngOnInit(){
				var that = this;
				this.sharedService.sharedObj.containerContext.title = "Subscription";	
                //this.subscriptions = [{subscription_name:"Koramangala"}];
                this.item = {};
                this.hidden = {view: false, buy: true};
                this.disabled = {field: false};
				this.sharedService.getUserProfile(function(user){
					that.userDetail = user;
					that.commonService.enduserService.getSubscription(that.userDetail.user_id,"")
					.subscribe( result => that.subscriptions = result.results);
				});				
          }


          onBuySub(evt){
			  this.showApplicationListDialog = true;
			  this.commonService.adminService.getApplication("")
					.subscribe( result => this.applications = result.results);
                //this.hidden = {view: true, buy: false};
                //this.disabled = {field: false};
          }
		  
		  onAppSelect(evt,app){
			  this.buyItem = {user_id: this.userDetail.user_id, app_name: app.app_name};
			  this.hidden = {view: true, buy: false};
			  this.showApplicationListDialog = false;
			  this.buyComponent.load(app.app_name);
			  //this.addSubscription(item);
		  }
		  
		  addSubscription(item){
			  this.commonService.enduserService.addSubscription(item)
				   .subscribe( data => {	
				   debugger;
					if(data.statusCode=="S"){
						//this.onAddressSaveCancel("");
						this.commonService.enduserService.getSubscription(this.userDetail.user_id,"")
							.subscribe( result => this.subscriptions = result.results);
					}
					else{
						alert("Unable to save");
					}		  
				  });
		  }

		  onSubSave(evt){

               

          }

          onSubSaveCancel(evt){
                this.hidden = {view: false, buy: true};
				this.commonService.enduserService.getSubscription(this.userDetail.user_id,"")
					.subscribe( result => this.subscriptions = result.results);
          }



}