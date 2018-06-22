//
import {Component,OnInit} from '@angular/core'
import {Router} from '@angular/router';
import { CommonService } from '../common.service';
import { SharedService } from '../shared.service';
declare var jQuery:any;
declare var gMap:any;

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
		templateUrl: './address.component.html',
		styleUrls: ['./address.component.css']
})
export class AppAddress implements OnInit {
		addresses: any;
		item: any;
		countries: any;
		states: any;
		cities: any;
		localities: any;
		hidden: any;
		disabled: any;
		userDetail: userDetail;

		constructor(private router: Router, private sharedService: SharedService, private commonService: CommonService) {
			this.router = router;
		} 

		ngOnInit(){
				var that = this;
				this.sharedService.sharedObj.containerContext.title = "Address";	
                this.addresses = [];
                this.item = {};
                this.countries = [{name:"India"}];
                this.states = [{name:"Karnataka"}];
                this.cities = [{name:"Bengaluru"}];
                this.localities = [{name:"Koramangala"},{name:"Jayanagar"},{name:"Whitefield"}];
                this.hidden = {view: false, add: true};
                this.disabled = {field: false};
				this.sharedService.getUserProfile(function(user){
					that.userDetail = user;
					that.commonService.enduserService.getAddress(that.userDetail.user_id,"")
					.subscribe( result => that.addresses = result.results);
				});
				
		}

 

		onAddressClick(evt,data){
                this.hidden = {view: true, add: false};
                this.disabled = {field: true};
                this.item = data;
				var map_point = data.map_point.split("/");
				this.loadGoogleMap(map_point[0],map_point[1]);
				document.getElementById('searchBoxContainer').style.display = "none";
		}

		onAddressAdd(evt){
                this.hidden = {view: true, add: false};
                this.disabled = {field: false};
				this.loadGoogleMap("","");
				document.getElementById('searchBoxContainer').style.display = "block";
		}

		onAddressSave(evt){
			if(this.sharedService.validateFields(document.getElementById('address_form'))){
				this.item.user_id = this.userDetail.user_id;
				this.item.map_point = gMap.latitude + "/" + gMap.longitude ;
					this.commonService.enduserService.addAddress(this.item)
					   .subscribe( data => {	
					   debugger;
						if(data.statusCode=="S"){
							this.onAddressSaveCancel("");
						}
						else{
							alert("Unable to save");
						}		  
					  });          
			}
		}

		onAddressSaveCancel(evt){
				this.commonService.enduserService.getAddress(this.userDetail.user_id,"")
					.subscribe( result => this.addresses = result.results);
                this.hidden = {view: false, add: true};
		}


		//Google Map
		loadGoogleMap(lat,lng){
                gMap.load(null,null,function(lat,lng){},lat,lng);
				document.getElementById('googleMap_address').innerHTML = "";
				document.getElementById('googleMap_address').appendChild(gMap.content);
				//document.getElementsByClassName('gMapSearchStyle')[0].style.display = "none";
		}
		
		locate(evt){
                var src = evt.source.ngControl.name;
                if(evt.value){
                        var address = "";
                        switch (src){
                            case "country":
                                if( this.item.state && this.item.city && this.item.locality ){
                                     address =   this.item.locality +", "+ this.item.city +", "+ this.item.state +", "+ evt.value;
                                }
								break;
								
							case "state":
                                if(this.item.country && this.item.city && this.item.locality ){
                                      address =   this.item.locality +", "+ this.item.city +", "+ evt.value +", "+ this.item.country;
                                }
                                break;
								
							case "city":
                               if(this.item.country && this.item.state && this.item.locality){
                                    address =   this.item.locality +", "+ evt.value +", "+ this.item.state +", "+ this.item.country;
                                }
                                break;
								
                            case "locality":
                                if(this.item.country && this.item.state && this.item.city ){
                                     address =   evt.value +", "+ this.item.city +", "+ this.item.state +", "+ this.item.country;
                                }
                                break;
                                                           
                        }
                        gMap.locate(address);
                }
        }

 

 

}