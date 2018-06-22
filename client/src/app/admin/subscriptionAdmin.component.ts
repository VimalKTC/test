//
import {Component, OnInit} from '@angular/core'
import {Router} from '@angular/router';
import { CommonService } from '../common.service';
import { SharedService } from '../shared.service';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

interface hidden {
  view: boolean,
  add: boolean
}
interface disabled {
  subscription_id: boolean,
  subscription_name: boolean
}
interface newItem {
	subscription_id: string,
	app_name: string,
	subscription_name: string,
	role_id: string,
	validity_unit: string,
	validity_period: string,
	amount: string,
	currency: string,
	post_allowed: string,
	post_day: string,
	post_priority: string,
	notification_sms: string,
	notification_email: string,
	notification_app: string,
	changedAt: string,
	changedBy: string,
	createdAt: string,
	createdBy: string,
	deleted: boolean
}

@Component({
    //selector: 'app-root',
    templateUrl: './subscriptionAdmin.component.html',
   styleUrls: ['./subscriptionAdmin.component.css'],
   providers: [CommonService]
})
export class AppSubscriptionAdmin implements OnInit {
	subscriptions: Array<{
		_id?: string,
		subscription_id: string,
		app_name: string,
		subscription_name: string,
		role_id: string,
		validity_unit: string,
		validity_period: string,
		amount: string,
		currency: string,
		post_allowed: string,
		post_day: string,
		post_priority: string,
		notification_sms: string,
		notification_email: string,
		notification_app: string
	}>;
	applications: Array<{
		_id?: string,
		app_id: string,
		app_name: string,
		deleted: boolean,
		createdBy: string,
		createdAt: string,
		changedBy: string,
		changedAt: string
	}>;
	validityUnits: Array<{
		_id?: string,
		unit: string
	}>;
	roles: Array<{
		_id?: string,
		role_id: string,
		role_name: string
	}>;
	router: Router;
	hidden: hidden;
	newItem: newItem;
	disabled: disabled;
	currencies: any = [];
	editMode: boolean = false;
	
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
		this.sharedService.sharedObj.containerContext.title = "Subscription";
	  	 this.hidden = {view: false, add: true};
		this.disabled = {subscription_id: true, subscription_name: false};
		this.newItem = {
						subscription_id: "",
						app_name: "",
						subscription_name: "",
						role_id: "",
						validity_unit: "",
						validity_period: "",
						amount: "",
						currency: "INR",
						post_allowed: "",
						post_day: "",
						post_priority: "",
						notification_sms: "",
						notification_email: "",
						notification_app: "",
						changedAt:"",
						changedBy:"",
						createdAt:"00/00/0000",
						createdBy:"",
						deleted:false
						};
			this.validityUnits = [{unit:"days"}];
			this.commonService.adminService.getApplication("")
				  .subscribe( applications => {
					  this.applications = applications.results;
				  });
			this.commonService.adminService.getRole("")
				.subscribe( roles => this.roles = roles.results);
	  	  this.commonService.adminService.getSubscription("","")
		  .subscribe( subscriptions => this.subscriptions = subscriptions.results); 
	}
	onAddClick(evt){		  
		  this.hidden.view = true;
		  this.hidden.add = false;
		  this.disabled.subscription_name = false;
		  this.editMode = false;
		  this.newItem = {
						subscription_id: "",
						app_name: "",
						subscription_name: "",
						role_id: "",
						validity_unit: "",
						validity_period: "",
						amount: "",
						currency: "INR",
						post_allowed: "",
						post_day: "",
						post_priority: "",
						notification_sms: "",
						notification_email: "",
						notification_app: "",
						changedAt:"",
						changedBy:"",
						createdAt:"00/00/0000",
						createdBy:"",
						deleted:false
						};
	  }
	  onAddCancel(evt){
		  this.hidden.view = false;
		  this.hidden.add = true;
		  this.commonService.adminService.getSubscription("","")
			  .subscribe( subscriptions => this.subscriptions = subscriptions.results);
	  }
	  onSave(evt){
		if(this.editMode)
			this.onEditSave(evt)
		else
			this.onAddSave(evt);
	  }
	  onAddSave(evt){
		  this.commonService.adminService.addSubscription(this.newItem)
			   .subscribe( data => {	
			    
				if(data.statusCode=="S"){
					this.onAddCancel("");
				}
				else{
					alert("Unable to save");
				}		  
			  });
	  }
	  onSubscriptionClick(evt,obj){
		  this.hidden.view = true;
		  this.hidden.add = false;	  
		  this.disabled.subscription_name = true;
		  this.newItem = obj;
	  }
	  onEdit(evt,doc){
		  this.hidden.view = true;
		  this.hidden.add = false;	  
		  this.disabled.subscription_name = false;
		  this.editMode = true;
		  this.newItem = doc;
	  }
	  onEditSave(evt){
		  var that = this;
		  this.commonService.adminService.updateSubscription(this.newItem)
			   .subscribe( data => {
				if(data.statusCode=="S"){
					this.onAddCancel("");
				}
				else{
					alert("Unable to update");
				}		  
			  }); 
	  }
	  
	  onDelete(evt,doc){
		  var that = this;
		  doc.deleted = true;
		  this.commonService.adminService.updateSubscription(doc)
			   .subscribe( data => {
				if(data.statusCode=="S"){
					this.onAddCancel("");
				}
				else{
					alert("Unable to delete");
				}		  
			  }); 
	  }
	  
	  onCheckBoxClick(evt,val){
		  if(evt.target.checked){
			 this.newItem[val] = 'X'
		  }
		  else{
			  this.newItem[val] = "";
		  }
	  }
}
