//
import {Component,OnInit,ViewChild} from '@angular/core';
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
declare var $:any;

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
      templateUrl: './home.component.html',
      styleUrls: ['./home.component.css'],
      providers: [CommonService]
})

@Injectable()
export class AppHome implements OnInit {
		cities: any;
		types: any;
		userDetail: userDetail;
		city : string = "";
		type: string = "All";
		search: string = "";
		results: any = [];
		suggestion: any = [];
		searchSelected: any = {};
		city_suggestion: any = [];
		citySelected: any = {};
		self: any = this;
		
      constructor(private router: Router, private http: Http, private commonService: CommonService, private sharedService: SharedService) {
              var that = this;;
                     this.getJSON().subscribe(data => {
                                           that.types = data.alertTypes;
                                           that.cities = data.cities;
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
        this.sharedService.sharedObj.containerContext.title = "Home";	
		this.sharedService.getUserProfile(function(user){
			that.userDetail = user;
			that.onSearch(null);
		});
		document.addEventListener("click", function (e) {
			that.suggestion = [];
			that.city_suggestion = [];
		});
		
		//For Search Field Key Press Event
		$('#searchInput').keydown(function(e){
				var listItems = $(".searchSuggestions");
				var key = e.keyCode;
				var selected = $('.autocomplete-selected').eq(0);
				var current;
					
				if ( key == 13 ){ // Enter key
					that.loadResult(that.searchSelected);
				}
					
				if ( key != 40 && key != 38 ) return;
				listItems.removeClass('autocomplete-selected');

				if ( key == 40 ){ // Down key
					if ( selected.length === 0 || selected.is(':last-child') ) {
						current = listItems.eq(0);
					}
					else {
						current = selected.next();
					}
					that.search = current.text();
					that.searchSelected = {
							product_type_name: current.data('product_type_name'),
							brand_name: current.data('brand_name'),
							model: current.data('model'),
							variant: current.data('variant'),
							text: current.text()
					};
				}
				else if ( key == 38 ){ // Up key
					if ( selected.length === 0 || selected.is(':first-child') ) {
						current = listItems.last();						
					}
					else {
						current = selected.prev();
					}
					that.search = current.text();
					that.searchSelected = {
							product_type_name: current.data('product_type_name'),
							brand_name: current.data('brand_name'),
							model: current.data('model'),
							variant: current.data('variant'),
							text: current.text()
					};
				}
				current.addClass('autocomplete-selected');
		});​
		
		
		//For Location Field Key Press Event
		$('#cityInput').keydown(function(e){
				var listItems = $(".citySuggestions");
				var key = e.keyCode;
				var selected = $('.city-selected').eq(0);
				var current;
					
				if ( key == 13 ){ // Enter key
					that.loadResult(that.searchSelected);
				}
					
				if ( key != 40 && key != 38 ) return;
				listItems.removeClass('city-selected');

				if ( key == 40 ){ // Down key
					if ( selected.length === 0 || selected.is(':last-child') ) {
						current = listItems.eq(0);						
					}
					else {
						current = selected.next();
					}
					that.city = current.text();
					that.citySelected =  {
							country: current.data('country'),
							state: current.data('state'),
							city: current.data('city'),
							location: current.data('location'),
							text: current.text()
					};
				}
				else if ( key == 38 ){ // Up key
					if ( selected.length === 0 || selected.is(':first-child') ) {
						current = listItems.last();
					}
					else {
						current = selected.prev();
					}
					that.city = current.text();
					that.citySelected =  {
							country: current.data('country'),
							state: current.data('state'),
							city: current.data('city'),
							location: current.data('location'),
							text: current.text()
					};
				}
				current.addClass('city-selected');
		});​
		
	}
	  
	  
	  suggest(evt){
			var key = evt.keyCode;
			if ( key != 40 && key != 38 && key != 13 ){
				var that = this;
				this.suggestion = [];
				this.searchSelected = {};
				var location = (this.citySelected.location !== undefined)?this.citySelected.location:"" ;
				var city = (this.citySelected.city !== undefined)?this.citySelected.city:"" ;
				var type = (this.type === "All")? "" : this.type ;
				this.commonService.enduserService.search(this.search,city,location,type)
					.subscribe( data => {			  
						  this.suggestion = data.results;
						  if(this.suggestion.length > 0)
							  this.searchSelected = this.suggestion[0];
					});
			}
	  }
	  
	  onSuggestSelect(evt,selected){
		  this.searchSelected = selected;
		  this.loadResult(selected);
	  }
	  
	  loadResult(selected){
		  var that = this;
		  this.search = selected.text;
		  this.suggestion = [];
		  var queries = {
			product_type_name: selected.product_type_name,
			brand_name: selected.brand_name,
			model: selected.model,
			variant: selected.variant
		  };
		  var type = (this.type === "All")? "" : this.type ;
		  var city = (this.citySelected.city !== undefined)?this.citySelected.city:"" ;
		  var location = (this.citySelected.location !== undefined)?this.citySelected.location:"" ;
		  this.commonService.enduserService.searchload(queries,type,city,location)
			  .subscribe( data => {			  
					  this.results = data.results;
					  jQuery.each(this.results,function(i,v){
							v.fav = false;
							//v.price = v.net_price;
							v.currency = "INR";
							v.no_image = "1";
							var transc_id = "";
							if(v.type === "Sale") transc_id = v.sell_id; 
							if(v.type === "Buy") transc_id = v.buy_req_id; 
							if(v.type === "Bid") transc_id = v.bid_id; 
							if(v.type === "Service") transc_id = v.service_id;
							that.getFav(v,transc_id);
							that.getResultImage(v,transc_id);
					  });
			  });
	  }
	  
	  onSearch(evt){
		  this.onSuggestSelect(evt,this.searchSelected);
	  }
	  
	  getFav(item,transaction_id){
		  this.commonService.enduserService.getFav(this.userDetail.user_id,transaction_id)
			  .subscribe( res => {			  
					var result = res.results;
					if(result.length > 0){
						if(result[0].bid_sell_buy_id === transaction_id)
							item.fav = true;
							item.fav_id = result[0]._id;
					}
			  });
	 }
	  
	  
	  
	/*onSearch(evt){
		var that = this;
		this.results = [];
		if(this.type == "Sell"){
			this.commonService.enduserService.getSell("","","")
			  .subscribe( data => {			  
					  this.results = data.results;
					  jQuery.each(this.results,function(i,v){
							v.fav = false;
							v.type = "Sale";
							v.price = v.net_price;
							v.currency = "INR";
							v.no_image = "1";
							that.getResultImage(v,v.sell_id);
					  });
			  });
		}
		if(this.type == "Buy"){
			this.commonService.enduserService.getBuy("","","")
			  .subscribe( data => {			  
					  this.results = data.results;
					  jQuery.each(this.results,function(i,v){
							v.fav = false;
							v.type = "Buy";
							v.price = v.net_price;
							v.currency = "INR";
							v.no_image = "1";
							that.getResultImage(v,v.buy_req_id);
					  });
			  });
		}
		if(this.type == "Bid"){
			this.commonService.enduserService.getBid("","","")
			  .subscribe( data => {			  
					  this.results = data.results;
					  jQuery.each(this.results,function(i,v){
							v.fav = false;
							v.type = "Bid";
							v.price = v.net_price;
							v.currency = "INR";
							v.no_image = "1";
							that.getResultImage(v,v.bid_id);
					  });
			  });
		}
		if(this.type == "All"){
			this.commonService.enduserService.getSell("","","")
			  .subscribe( data => {			  
					  this.results = data.results;
					  jQuery.each(this.results,function(i,v){
							v.fav = false;
							v.type = "Sale";
							v.price = v.net_price;
							v.currency = "INR";
							v.no_image = "1";
							that.getResultImage(v,v.sell_id);
					  });
			  });
		}
		
	}*/
	
	suggestCity(evt){
		var key = evt.keyCode;
		if ( key != 40 && key != 38 && key != 13 ){
			var that = this;
			this.city_suggestion = [];
			this.citySelected = {};
			this.commonService.enduserService.searchLoc(this.city)
				.subscribe( data => {			  
					this.city_suggestion = data.results;
					 if(this.city_suggestion.length > 0)
						  this.citySelected = this.city_suggestion[0];
				});
		}
	}
	
	onCitySuggestSelect(evt,selected){
		this.citySelected = selected;
		this.city = selected.text;	
		this.city_suggestion = [];
		this.loadResult(this.searchSelected);
	}
	
	
	
	
	getResultImage(item,transaction_id){
		  this.commonService.enduserService.getImage("","",transaction_id)
			  .subscribe( prdImages => {			  
					  var prdImage = prdImages.results;
					  if(prdImage.length > 0){
						  var base64string = this.arrayBufferToBase64(prdImage[0].data.data);
						  item.data = "data:"+prdImage[0].type+";base64,"+base64string;
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
		else if(item.type == "Buy"){
			this.router.navigate(['/Container/Buy',item.buy_req_id]);
		}
		else if(item.type == "Bid"){
			this.router.navigate(['/Container/Bid',item.bid_id]);
		}
		else if(item.type == "Service"){
			this.router.navigate(['/Container/Service',item.service_id]);
		}
	}
	
	
	onTypeSelect(evt){
		this.onSuggestSelect(evt,this.searchSelected);
	}
	
	onFav(evt,item){
		debugger;
		/*if(item.sell_id || item.buy_req_id || item.bid_id || item.service_id){
			var newFav:any = {};
			newFav.user_id = this.userDetail.user_id;		
			newFav.deleted = false;		
			newFav.createdBy = this.userDetail.user_id;
			newFav.changedBy = this.userDetail.user_id;
			if(item.sell_id){
				newFav.bid_sell_buy_id = item.sell_id;
				newFav.type = "Sale";
			}
			if(item.buy_req_id){
				newFav.bid_sell_buy_id = item.buy_req_id;
				newFav.type = "Buy";
			}
			if(item.bid_id){
				newFav.bid_sell_buy_id = item.bid_id;
				newFav.type = "Bid";
			}
			if(item.service_id){
				newFav.bid_sell_buy_id = item.service_id;
				newFav.type = "Service";
			}
			
			if(evt.target.id == "fav"){
				newFav._id = item.fav_id;
				this.commonService.enduserService.deleteFav(newFav)
					.subscribe( res => {					    
						if(res.ok === 1){
							alert("Removed");
						}
						else{
							alert("Cannot remove.");
						}
					});			
			}
			if(evt.target.id == "not-fav"){			
				this.commonService.enduserService.addFav(newFav)
					.subscribe( res => {					    
						if(res.statusCode=="S"){
							
							alert("Added");
						}
						else{
							alert("Cannot add.");
						}
					});
			}
		}*/
	}
	
	reloadItems(){
		this.onSuggestSelect(null,this.searchSelected);
	}
	
	
	onRemoveCitySearch(evt){
		this.citySelected = {};
		this.loadResult(this.searchSelected);
		this.city = "";
	}
	
	onRemoveSearch(evt){
		this.searchSelected = {};
		this.loadResult(this.searchSelected);
		this.search = "";
	}
}
