//
import {Component,OnInit,ElementRef,ViewChild, Input} from '@angular/core';
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
      selector: 'bid-by',
      templateUrl: './bidBy.component.html',
      styleUrls: ['./bidBy.component.css'],
      providers: [CommonService]
})

@Injectable()
export class AppBidBy implements OnInit {
		localData: any;
		userDetail: userDetail;
		self: any = this;
		results: any = [];
		@Input() parent;
		@Input() bid;
		
      constructor(private router: Router, private http: Http, private commonService: CommonService, private sharedService: SharedService,private elementRef:ElementRef) {
                     this.router = router;
                     var that = this;;
                     this.getJSON().subscribe(data => {
                                   that.localData = data;        
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
				var that = this;
				this.sharedService.getUserProfile(function(user){
					that.userDetail = user;
				});
				
				/*if(this.userDetail.user_id){
					this.commonService.enduserService.getBid(this.userDetail.user_id,"","")
					  .subscribe( data => {
						  this.bid = data.results;						  
					  });					
				}*/
      }
	  
	  minus(evt){
		  if((this.bid.bid_hike_by - this.bid.min_bid_hike) > 0){
			  //this.bid.current_bid_amount = (this.bid.current_bid_amount - (-this.bid.bid_hike_by));//Increase the previous Decreased hike
			  this.bid.bid_hike_by = (this.bid.bid_hike_by - this.bid.min_bid_hike);// decrease the hike by value
			  this.bid.current_bid_amount = (this.bid.current_bid_amount - this.bid.min_bid_hike);//then decrease
		  }
	  }
	  
	  add(evt){
		this.bid.current_bid_amount = (this.bid.current_bid_amount - this.bid.bid_hike_by);//Decrease the previous increased hike
		this.bid.bid_hike_by = (this.bid.bid_hike_by - (- this.bid.min_bid_hike));// increase the hike by value
		this.bid.current_bid_amount = (this.bid.current_bid_amount - (- this.bid.bid_hike_by));//then increase
	  }
	  
	  onSubmit(evt){
			var that = this;
			var item:any = {};
			//item.bid_by_user_id = this.userDetail.user_id;
			item.bid_id = this.bid.bid_id;
			item.bid_amount = this.bid.previous_bid_amount;
			item.bid_hike_by = this.bid.bid_hike_by;
			item.current_bid_amount = this.bid.current_bid_amount;
			item.deleted = false;
			item.createdBy = this.userDetail.user_id;
			item.changedBy = this.userDetail.user_id;
						
			this.commonService.enduserService.addBidBy(item)
			.subscribe( data => {	
				  // debugger;
					if(data.statusCode=="S"){
						alert('Submitted');
						this.updateBid();
					}
					else{
						//alert('Cannot submit the request.');
						var msg: any = "Unable to submit the request.";
						if(data.msg)
							msg = data.msg;
							
						 this.sharedService.openMessageBox("E",msg,function(){});
					}
			});
	  }
	  
	  updateBid(){
		var d = new Date();
		var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
		var update = {
			_id: this.bid._id,
			bid_id: this.bid.bid_id,
			current_bid_amount: this.bid.current_bid_amount,
			current_bid_by: this.userDetail.user_id,
			current_bid_at: at
		};
		this.commonService.enduserService.updateBid(update)
		  .subscribe( data => {	
			   //debugger;
				if(data.statusCode=="S"){
					alert("Bid updated.");
				}
				else{
					//alert("Bid update failed.");
					var msg: any = "Unable to update the bid.";
					if(data.msg)
						msg = data.msg;
						
					this.sharedService.openMessageBox("E",msg,function(){});
				}
		});
	  }
		
}
