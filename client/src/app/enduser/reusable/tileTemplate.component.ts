import {Component,OnInit,Input,Output,EventEmitter} from '@angular/core';
import { Injectable }     from '@angular/core';
import {Router} from '@angular/router';
import { CommonService } from '../../common.service';
import { SharedService } from '../../shared.service';
declare var jQuery:any;

@Component({
      selector: 'tile-template',
      templateUrl: './tileTemplate.component.html',
      styleUrls: ['./tileTemplate.component.css'],
      providers: [CommonService]
})

@Injectable()
export class AppTileTemplate implements OnInit {		
		userDetail: any = {};
		localData: any;
		@Input() item;
		@Input() parentComponent;
		@Output() openItem = new EventEmitter();
		
    constructor(private router: Router, private commonService: CommonService, private sharedService: SharedService) {
           
	}

    ngOnInit(){
		var that = this;
		if(this.item.sell_id)
			this.item.transactionTyp = 'Sale';
		else if(this.item.buy_req_id)
			this.item.transactionTyp = 'Buy';
		else if(this.item.bid_id)
			this.item.transactionTyp = 'Bid';
		else if(this.item.service_id)
			this.item.transactionTyp = 'Service';
		
		if(this.item.createdAt){
			var dateArray = this.item.createdAt.split('/');
			var monthList = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
			this.item.createdOn = dateArray[0]+ " " + monthList[dateArray[1]];
		}
		
		this.sharedService.getUserProfile(function(user){
				that.userDetail = user;
		});
    }
	
	open(evt,data) {
        this.openItem.emit(data);
    }
	
	onFavClick(evt){
		if(this.item.sell_id || this.item.buy_req_id || this.item.bid_id || this.item.service_id){
			var newFav:any = {};
			newFav.user_id = this.userDetail.user_id;		
			newFav.deleted = false;		
			newFav.createdBy = this.userDetail.user_id;
			newFav.changedBy = this.userDetail.user_id;
			if(this.item.sell_id){
				newFav.bid_sell_buy_id = this.item.sell_id;
				newFav.type = "Sale";
			}
			if(this.item.buy_req_id){
				newFav.bid_sell_buy_id = this.item.buy_req_id;
				newFav.type = "Buy";
			}
			if(this.item.bid_id){
				newFav.bid_sell_buy_id = this.item.bid_id;
				newFav.type = "Bid";
			}
			if(this.item.service_id){
				newFav.bid_sell_buy_id = this.item.service_id;
				newFav.type = "Service";
			}
			
			if(evt.target.id == "fav"){
				this.removeFav(newFav);
							
			}
			if(evt.target.id == "not-fav"){			
				this.commonService.enduserService.addFav(newFav)
					.subscribe( res => {					    
						if(res.statusCode=="S"){
							this.parentComponent.reloadItems();
							alert("Added");
						}
						else{
							alert("Cannot add.");
						}
					});
			}
		}
	}
	
	
	removeFav(newFav){
		var that = this;
		this.sharedService.openMessageBox("C","Are you sure you want to remove the item from your favourite list? Press Ok if yes.",function(flag){
				newFav._id = that.item.fav_id;
				that.commonService.enduserService.deleteFav(newFav)
					.subscribe( res => {					    
						if(res.ok === 1){
							that.sharedService.closeMessageBox();
							that.parentComponent.reloadItems();
							alert("Removed");
						}
						else{
							alert("Cannot remove.");
						}
					});
		});
	}
}
