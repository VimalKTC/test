//
import {Component, OnInit,ViewChild} from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Router} from '@angular/router';
import { CommonService } from '../common.service';
import { SharedService } from '../shared.service';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { AppAccountDetail } from './accountdetail.component';
import { AppDynamicForm } from './reusable/dynamicForm.component';
import { AuthenticationService } from '../authentication.service';
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
    selector: 'app-root',
    templateUrl: './container.component.html',
   styleUrls: ['./container.component.css'],
   //directives : [AppAccountDetail]
})
export class AppContainer implements OnInit{
		router: Router;
		userDetail: any = {};
		title: string = "";
		filterItem: any = [];
		ownItem: boolean = true;
		self: any = this;
		editMode: boolean = true;
		showFilterDialog: boolean = false;
		screenAccess: any = [];
		otherAccess: any = {};
		enableAccount: boolean = false;
		enableAddress: boolean = false;
		enableSubscription: boolean = false;
		enableAlert: boolean = false;
		enableFav: boolean = false;
		filterFlag: boolean = false;
		@ViewChild(AppDynamicForm) dynamicFormComponent: AppDynamicForm;
		opened: boolean = false;
	
		constructor(private auth: AuthenticationService, private http: Http, private sharedService: SharedService, private commonService: CommonService, router: Router) {
					this.router = router;
					var that = this;;
                    this.getJSON().subscribe(data => {
                                   that.sharedService.sharedObj.localData = data;        
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
			this.sharedService.sharedObj.containerContext = this;					
			
			var lastScrollTop = 0;
			var goUp    = false;
			var goUpVal = 0;
			/*jQuery(window).scroll(function(event){
			   var st = jQuery(this).scrollTop();
			   if (st > lastScrollTop){
					// downscroll code
					goUp = false;
					if (st => 100){
						jQuery('.headerStyle').addClass('off-canvas');
						jQuery('.footerStyle').addClass('on-canvas');
					}
			   } else {
				// upscroll code
					if (!goUp) {
						goUp = true;
						goUpVal = st;
					}
				  if (goUpVal - st >= 350 || st === 0) {
					jQuery('.headerStyle').removeClass('off-canvas');
					jQuery('.footerStyle').removeClass('on-canvas');
				  }
			   }
			   lastScrollTop = st;
			});*/
			
			document.getElementById('userscreen_frame').addEventListener('dblclick',function(e){
				//debugger;
				if(jQuery('.footerStyle') && !(jQuery('.footerStyle').hasClass('on-canvas'))){
					jQuery('.footerStyle').addClass('on-canvas');
					setTimeout(function(){ 
						jQuery('.footerStyle').removeClass('on-canvas'); 
					}, 8000);
				}
			});
			
			//jQuery('.footerStyle').addClass('on-canvas');
			
			this.sharedService.getUserProfile(function(user){
				that.userDetail = user;
				that.screenAccess = [];
				that.otherAccess = {};
				var access = user.screenAccess;	
				for(var i = 0; i<access.length; i++){
					if((access[i].name).toLowerCase().indexOf('sell') != -1
						|| (access[i].name).toLowerCase().indexOf('buy') != -1
							|| (access[i].name).toLowerCase().indexOf('bid') != -1
								|| (access[i].name).toLowerCase().indexOf('service') != -1){						
						access[i].id = ((access[i].name).replace(/ /g,"")).toLowerCase()+"_link" ;
						that.screenAccess.push(access[i]);
					}
					else{
						var id = ((access[i].name).replace(/ /g,"")).toLowerCase();
						that.otherAccess[id] = access[i];
						if(id === 'account' && access[i].applicable)
							that.enableAccount = true;
						if(id === 'address' && access[i].applicable)
							that.enableAddress = true;
						if(id === 'subscription' && access[i].applicable)
							that.enableSubscription = true;
						if(id === 'alert' && access[i].applicable)
							that.enableAlert = true;
						if(id === 'favourite' && access[i].applicable)
							that.enableFav = true;
					}
				}
				that.screenAccess.sort((a: any, b: any)=> {return a.sequence - b.sequence;});//ascending sort
				that.commonService.enduserService.getFilter(that.userDetail.user_id)
				  .subscribe( data => {	
					if(data.results.length > 0)
						that.filterItem = data.results;
					that.checkFilter();
				  });
			});
			
		}
		
		checkFilter(){
			var that = this;
			this.filterFlag = false;
			for(var i=0; i<this.filterItem.length; i++){
					if(this.filterItem[i].filter_value){
						that.filterFlag = true;
						break;
					}
			}			
		}
		
		openNav() {
			//document.getElementById("mySidenav").style.display = "block";
			//document.getElementById("myOverlay").style.display = "block";
		}

		closeNav() {
			this.opened = false;
			//document.getElementById("mySidenav").style.display = "none";
			//document.getElementById("myOverlay").style.display = "none";
		}

		onUserClick(evt){
			debugger;
		}

		onNav(evt){
			var link = evt.srcElement.id;
			var that = this;
			switch(link){
				case "home_link":
					that.router.navigateByUrl('/Container/Home');
					break;
					
				case "favourite_link":
					that.router.navigateByUrl('/Container/Favourite');
					break;
				
				case "account_link":
					that.router.navigateByUrl('/Container/Account');
					break;
				
				case "address_link":
					that.router.navigateByUrl('/Container/Address');
					break;
					
				case "subscription_link":
					that.router.navigateByUrl('/Container/Subscription');
					break;
					
				case "alert_link":
					that.router.navigateByUrl('/Container/Alert');
					break;
					
				case "sell_link":
					that.router.navigateByUrl('/Container/Sell');
					break;
				case "bid_link":
					that.router.navigateByUrl('/Container/Bid');
					break;
				case "buy_link":
					that.router.navigateByUrl('/Container/Buy');
					break;
				case "service_link":
					that.router.navigateByUrl('/Container/Service');
					break;
			}
			this.closeNav();
		}
		
		onHome(){
			this.router.navigateByUrl('/Container/Home');
			this.closeNav();
		}
		onNameClick(evt){
			this.router.navigateByUrl('/Container/Account');
			this.closeNav();
		}
		onAddressClick(evt){
			this.router.navigateByUrl('/Container/Address');
			this.closeNav();
		}
		onSubscriptionClick(evt){
			this.router.navigateByUrl('/Container/Subscription');
			this.closeNav();
		}
		onAlertClick(evt){
			this.router.navigateByUrl('/Container/Alert');
			this.closeNav();
		}
		onFavClick(evt){
			this.router.navigateByUrl('/Container/Favourite');
			this.closeNav();
		}
		

	onFilter(evt){
		/*this.showFilterDialog = true;
		this.editMode = true;
		this.ownItem = true;
		this.commonService.enduserService.getFilter(this.userDetail.user_id,"")
		  .subscribe( data => {	
			if(data.results.length > 0)
				this.filterItem = data.results[0];
			this.dynamicFormComponent.showNavigationTab = false;
			this.dynamicFormComponent.generateField("Filter");
		});	*/
		this.router.navigateByUrl('/Container/Filter');
		this.closeNav();
	}
	
	/*onSave(evt){
		var that = this;
		var setting: any = {user_id: this.userDetail.user_id};
		var screenConfig = this.dynamicFormComponent.screenConfig;
		jQuery.each(screenConfig, function(field,value){
			jQuery.each(value, function(i,v){
				setting[v.field_path] = v.value;
			});
		});
		if(this.filterItem._id){
			setting._id = this.filterItem._id;
			this.commonService.enduserService.updateFilter(setting)
			  .subscribe( data => {	
			   debugger;
				if(data.statusCode=="S"){
					this.showFilterDialog = false;
					that.commonService.enduserService.getFilter(that.userDetail.user_id,"")
					  .subscribe( res => {	
						if(res.results.length > 0)
							that.filterItem = res.results[0];
					  });
					alert('Saved Successfully.');
				}
				else{
					alert('Unable to save.');
				}
			});	
		}
		else{
			this.commonService.enduserService.addFilter(setting)
			  .subscribe( data => {	
			   debugger;
				if(data.statusCode=="S"){
					this.showFilterDialog = false;
					that.commonService.enduserService.getFilter(that.userDetail.user_id,"")
					  .subscribe( res => {	
						if(res.results.length > 0)
							that.filterItem = res.results[0];
					  });
					alert('Saved Successfully.');
				}
				else{
					alert('Unable to save.');
				}
			});	
		}		
	  }*/
	
	logout(){
		this.auth.logout();
	}
	
	
	
	
	

}
