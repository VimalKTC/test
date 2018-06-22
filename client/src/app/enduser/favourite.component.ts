//
import {Component,OnInit} from '@angular/core';
import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Router} from '@angular/router';
import { CommonService } from '../common.service';
import { SharedService } from '../shared.service';
import { AppTileTemplate } from './reusable/tileTemplate.component';
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
      templateUrl: './favourite.component.html',
      styleUrls: ['./favourite.component.css'],
      providers: [CommonService]
})

@Injectable()
export class AppFav implements OnInit {
		showConfirmDialog: boolean = false;
		userDetail: userDetail;
		results: any = [];
		unFavItem: any = {};
		self: any = this;

      constructor(private router: Router, private http: Http, private commonService: CommonService, private sharedService: SharedService) {
              var that = this;;
                     this.getJSON().subscribe(data => {
						 
                     }, error => {
                                  console.log(error);
                     });
	  }
      public getJSON(): Observable<any> {
                          return this.http.get("./assets/local.json")
                                   .map((res) => res.json())
                                   //.catch((error) => console.log(error));
      }
      

      ngOnInit(){
        this.sharedService.sharedObj.containerContext.title = "Favourite";	
		var that = this;
		this.results = [];
		this.sharedService.getUserProfile(function(user){
			that.userDetail = user;
			that.loadFavourites();
		});
				
	}
	
	loadFavourites(){
		this.commonService.enduserService.getFav(this.userDetail.user_id,"")
			  .subscribe( data => {			  
					  this.results = data.results;						
						this.getItemDetails();
			  });
	}
	
	getItemDetails(){
		var that = this;
		jQuery.each(this.results,function(i,v){
			v.fav = true;
			v.fav_id = v._id;
			if(v.type == "Sale"){
				that.commonService.enduserService.getSell("",v.bid_sell_buy_id,"")
				  .subscribe( data => {			  
						var res = data.results[0];
						jQuery.each(res,function(key,val){
							if(key !== "_id")
								v[key] = val;
						});
						//v.price = res.net_price;
						//v.currency = "INR";
						//v.no_image = "1";
						v.transactionTyp = "Sale";
						that.commonService.enduserService.getImage("","",v.bid_sell_buy_id)
						  .subscribe( prdImages => {			  
								  var prdImage = prdImages.results;
								  if(prdImage.length > 0){
									  var base64string = that.arrayBufferToBase64(prdImage[0].data.data);
									  v.data = "data:"+prdImage[0].type+";base64,"+base64string;
								  }
						  });
				  });
			}
			if(v.type == "Buy"){
				that.commonService.enduserService.getBuy("",v.bid_sell_buy_id,"")
				  .subscribe( data => {			  
						var res = data.results[0];
						jQuery.each(res,function(key,val){
							if(key !== "_id")
								v[key] = val;
						});
						//v.price = res.net_price;
						//v.currency = "INR";
						//v.no_image = "1";
						v.transactionTyp = "Buy";
						that.commonService.enduserService.getImage("","",v.bid_sell_buy_id)
						  .subscribe( prdImages => {			  
								  var prdImage = prdImages.results;
								  if(prdImage.length > 0){
									  var base64string = that.arrayBufferToBase64(prdImage[0].data.data);
									  v.data = "data:"+prdImage[0].type+";base64,"+base64string;
								  }
						  });
				  });
			}
			if(v.type == "Bid"){
				that.commonService.enduserService.getBid("",v.bid_sell_buy_id,"")
				  .subscribe( data => {			  
						var res = data.results[0];
						jQuery.each(res,function(key,val){
							if(key !== "_id")
								v[key] = val;
						});
						//v.price = res.net_price;
						//v.currency = "INR";
						//v.no_image = "1";
						v.transactionTyp = "Bid";
						that.commonService.enduserService.getImage("","",v.bid_sell_buy_id)
						  .subscribe( prdImages => {			  
								  var prdImage = prdImages.results;
								  if(prdImage.length > 0){
									  var base64string = that.arrayBufferToBase64(prdImage[0].data.data);
									  v.data = "data:"+prdImage[0].type+";base64,"+base64string;
								  }
						  });
				  });
			}
			if(v.type == "Service"){
				that.commonService.enduserService.getService("",v.bid_sell_buy_id,"")
				  .subscribe( data => {			  
						var res = data.results[0];
						jQuery.each(res,function(key,val){
							if(key !== "_id")
								v[key] = val;
						});
						//v.price = res.net_price;
						//v.currency = "INR";
						//v.no_image = "1";
						v.transactionTyp = "Service";
						that.commonService.enduserService.getImage("","",v.bid_sell_buy_id)
						  .subscribe( prdImages => {			  
								  var prdImage = prdImages.results;
								  if(prdImage.length > 0){
									  var base64string = that.arrayBufferToBase64(prdImage[0].data.data);
									  v.data = "data:"+prdImage[0].type+";base64,"+base64string;
								  }
						  });
				  });
			}
		});
	}
	
	 
	 arrayBufferToBase64( buffer ) {
		var binary = '';
		var bytes = new Uint8Array( buffer );
		var len = bytes.byteLength;
		for (var i = 0; i < len; i++) {
			binary += String.fromCharCode( bytes[ i ] );
		}
		return window.btoa( binary );
	}
	
	
	onItemSelect(item){
		if(item.type == "Sale"){
			this.router.navigate(['/Container/Sell',item.sell_id]);
		}
		if(item.type == "Buy"){
			this.router.navigate(['/Container/Buy',item.buy_req_id]);
		}
		if(item.type == "Bid"){
			this.router.navigate(['/Container/Bid',item.bid_id]);
		}
		if(item.type == "Service"){
			this.router.navigate(['/Container/Service',item.service_id]);
		}
	}
	
	reloadItems(){
		this.loadFavourites();
	}
	
	/*onUnFavourite(evt,item){
		this.unFavItem = item;
		this.showConfirmDialog = true;
	}
	
	onUnFavYes(){
		if(this.unFavItem){
			this.commonService.enduserService.deleteFav(this.unFavItem)
			  .subscribe( data => {			  
				if(data.ok === 1){
					alert("Removed Successfully.");
					this.showConfirmDialog = false;
					this.loadFavourites();
				}
			});
		}
	}
	
	onUnFavNo(){
		this.showConfirmDialog = false;
	}*/
}
