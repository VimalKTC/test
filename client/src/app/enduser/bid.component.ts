//
import {Component,OnInit,ElementRef,ViewChild} from '@angular/core';
import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Router, ActivatedRoute} from '@angular/router';
import { CommonService } from '../common.service';
import { SharedService } from '../shared.service';
import { AppDynamicForm } from './reusable/dynamicForm.component';
import { AppImageTemplate } from './reusable/imageTemplate.component';
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
      templateUrl: './bid.component.html',
      styleUrls: ['./bid.component.css'],
      providers: [CommonService]
})

@Injectable()
export class AppBid implements OnInit {
		localData: any;
		item: any = {};
		image_item: any;
		hidden: any;
		disabled: any;
		userDetail: any = {};
		showListDialog: boolean = false;
		showProductListDialog: boolean = false;
		showProductTypeListDialog: boolean = false;
		showBrandListDialog: boolean = false;
		showProductColorDialog: boolean = false;
		productTypes: any = [];
		brands: any = [];
		products: any = [];
		fields: any = [];
		screenConfig: any = {};
		selectedPrdTyp: string = "";
		self: any = this;
		editMode: boolean = true;
		detail: boolean = false;
		results: any = [];
		colors: any = [];
		screenMode: any = {add:false, edit:false};
		participate: boolean = false;
		bidItem: any = {};
		bidHikePc: string = '0';
		@ViewChild(AppDynamicForm) dynamicFormComponent: AppDynamicForm;
		@ViewChild(AppImageTemplate) imageTemplateComponent: AppImageTemplate;
		@ViewChild(AppTileTemplate) tileTemplateComponent: AppTileTemplate;
		
      constructor(private router: Router, private route: ActivatedRoute, private http: Http, private commonService: CommonService, private sharedService: SharedService,private elementRef:ElementRef) {
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
				this.item = {};
				this.image_item = [];
                var that = this;
                this.hidden = {view: false, add: true};
                this.disabled = {field: false};
				this.sharedService.getUserProfile(function(user){
					that.userDetail = user;
					if(that.userDetail.user_id){
						var id = that.route.snapshot.params.id;
						if(id){
							that.commonService.enduserService.getBid("",id,"")
							  .subscribe( data => {
								  if(data.results.length > 0){
									var item = data.results[0];
									that.detail = true;
									that.editMode = false;
									that.screenMode = {add:false, edit:false};
									that.dynamicFormComponent.generateDisplayField("Bid",item);
									that.imageTemplateComponent.getTransactionThumbnails(item.bid_id);
									that.item = item;
									that.item.transactionTyp = "Bid";
								  }
								  else{
									  alert("No data found.");
								  }
								});
						}
						else{
							that.commonService.enduserService.getBid(that.userDetail.user_id,"","")
							  .subscribe( data => {
								  that.results = data.results;
								  jQuery.each(that.results,function(i,v){
										that.getResultImage(v);
										that.getFav(v,v.bid_id); 
									});
							  });
						}						  
					}
					
					
					that.commonService.adminService.getParameter("bid_hike_pc")
						.subscribe( data => {
								if(data.results.length > 0){
								  that.bidHikePc = data.results[0].value;
								}
					});
				});
				this.sharedService.sharedObj.containerContext.title = "Bid";
				
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
	  
	  getResultImage(item){
		  this.commonService.enduserService.getImage(this.userDetail.user_id,"",item.bid_id)
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
	  
	  createNew(evt){
			this.commonService.adminService.getProductType("")
				.subscribe( productTypes => this.productTypes = productTypes.results);		
			this.showListDialog = true;
			this.showProductTypeListDialog = true;  
			this.showProductListDialog = false;
			this.showBrandListDialog = false;
			this.showProductColorDialog = false;
			this.item = {};
	  }
	  
	  openItem(item){
		this.detail = true;
		this.editMode = false;
		this.screenMode = {add:false, edit:false};
		this.dynamicFormComponent.generateDisplayField("Bid",item);
		this.imageTemplateComponent.getTransactionThumbnails(item.bid_id);
		this.item = item;
		this.item.transactionTyp = "Bid";
	  }
	  
	  onPrdTypSelect(evt,prdTyp){
			this.selectedPrdTyp = prdTyp.product_type_id;
			this.commonService.adminService.getUniqueBrandBasedOnPrdTyp(this.selectedPrdTyp)
				.subscribe( brands => this.brands = brands.results);
			
			this.showProductTypeListDialog = false;
			this.showProductListDialog = false;
			this.showBrandListDialog = true;
	  }
	  
	  onBrandSelect(evt,brand){
			this.commonService.adminService.getProduct("",this.selectedPrdTyp,brand)
				.subscribe( products => this.products = products.results);
			this.showBrandListDialog = false;
			this.showProductTypeListDialog = false;
			this.showProductListDialog = true;
	  }
	  
	  
	  onPrdSelect(evt,prd){
		  this.item.product_id = prd.product_id;
		  this.item.product_type_id = prd.product_type_id;
		  this.item.product_type_name = prd.product_type_name;
		  this.item.brand_id = prd.brand_id;
		  this.item.brand_name = prd.brand_name;
		  this.item.model = prd.model;
		  this.item.variant = prd.variant;
		  this.item.transactionTyp = "Bid";
		  this.commonService.adminService.getPrdThumbnailColors(prd.product_id)
				.subscribe( res => this.colors = res.results);
				
		  this.showProductListDialog = false;
		  this.showProductColorDialog = true;	
	  }
	  
	  onPrdColorSelect(evt,color){
		this.item.color = color;
		this.showProductColorDialog = false;
		this.showListDialog = false;
		
		this.detail = true;
		this.editMode = true;
		this.screenMode = {add:true, edit:false};
		this.dynamicFormComponent.generateField("Bid");
		this.imageTemplateComponent.getThumbnails(this.item.product_id);
	  }
	  
	  	  
	  save(saveItem){
			saveItem.user_id = this.userDetail.user_id;
			saveItem.name = this.userDetail.name;
			saveItem.mobile = this.userDetail.mobile;
			saveItem.address_id = this.dynamicFormComponent.item.address_id;
			saveItem.number_of_image = this.imageTemplateComponent.item.number_of_image;
			var that = this;
			if(saveItem.bid_id){//Edit an existing Bid
				this.commonService.enduserService.updateBid(saveItem)
				  .subscribe( data => {	
				   //debugger;
					if(data.statusCode=="S"){
						//Upload Image
						jQuery.each(this.imageTemplateComponent.thumbnails, function(i,v){
							if(v._id){//update
								
								that.commonService.enduserService.updateThumbnail(v)
									.subscribe( res_thumbnail => {												
										if(res_thumbnail.statusCode=="S"){													
										
										}
										else{
											alert("Unable to save thumbnail.");
										}
										that.onEditCancel("");
								});
							}
							else if(v.newImage){//insert new								
									var image_name = "";
									var image = that.imageTemplateComponent.newImages[v.newImageLink]
									image.transaction_id = saveItem.bid_id;
									image.name = image_name;
									image.user_id = that.userDetail.user_id;
									that.commonService.enduserService.addImage(image)
									   .subscribe( res_image => {							
										if(res_image.statusCode=="S"){
											//Upload Thumbnail
											v.transaction_id = saveItem.bid_id;
											v.name = image_name;
											v.image_id = res_image.image.image_id;
											v.user_id = that.userDetail.user_id;
											that.commonService.enduserService.addThumbnail(v)
											   .subscribe( res_thumbnail => {												
												if(res_thumbnail.statusCode=="S"){													
													
												}
												else{
													alert("Unable to save thumbnail.");
												}
												that.onEditCancel("");
											  });
											
										}
										else{
											alert("Unable to save image.");
											that.onEditCancel("");
										}
									   });

							}
						});							
					}
					else{
						//alert("Unable to save");
						that.sharedService.openMessageBox("E",data.msg,null);
					}		  
				  });
			}
			else{//Create New Bid
				this.commonService.enduserService.addBid(saveItem)
				  .subscribe( data => {	
				   //debugger;
					if(data.statusCode=="S"){
						//Upload Image
						jQuery.each(this.imageTemplateComponent.thumbnails, function(i,v){
							//if(v.newImage){								
									var image_name = "";
									var image = that.imageTemplateComponent.newImages[v.newImageLink]
									image.transaction_id = data.result.bid_id;
									image.name = image_name;
									image.user_id = that.userDetail.user_id;
									that.commonService.enduserService.addImage(image)
									   .subscribe( res_image => {							
										if(res_image.statusCode=="S"){
											//Upload Thumbnail
											v.transaction_id = data.result.bid_id;
											v.name = image_name;
											v.image_id = res_image.image.image_id;
											v.user_id = that.userDetail.user_id;
											that.commonService.enduserService.addThumbnail(v)
											   .subscribe( res_thumbnail => {												
												if(res_thumbnail.statusCode=="S"){													
													
												}
												else{
													alert("Unable to save thumbnail.");
												}
												that.onBidCancel();
											  });
											
										}
										else{
											alert("Unable to save image.");
											that.onBidCancel();
										}
									   });

							//}
						});							
					}
					else{
						//alert("Unable to save");
						that.sharedService.openMessageBox("E",data.msg,null);
					}		  
				  });
			}				  
	  }
	  
	  onBidSave(){
		  var screenConfig = this.dynamicFormComponent.screenConfig;
		  var saveItem: any = {};
		  jQuery.each(screenConfig, function(field,value){
			  jQuery.each(value, function(i,v){
				saveItem[v.field_path] = v.value;
			  });
		  });
		  saveItem.current_bid_amount = saveItem.bid_amount;
		  this.save(Object.assign(saveItem, this.item));
	  }
	  
	  onBidCancel(){
		  this.detail = false;
		  var that = this;
		  this.screenMode = {add:false, edit:false};
		  this.commonService.enduserService.getBid(this.userDetail.user_id,"","")
			.subscribe( data => {
				this.results = data.results;
				jQuery.each(this.results,function(i,v){
					that.getResultImage(v);
					that.getFav(v,v.bid_id); 
				});
			});
	  }
	  
	  onEdit(evt){
		this.detail = true;
		this.editMode = true;
		this.screenMode = {add:false, edit:true};
		this.dynamicFormComponent.generateField("Bid");
		this.imageTemplateComponent.getTransactionThumbnails(this.item.bid_id);
	  }
	  
	  onEditCancel(evt){
		this.detail = true;
		this.editMode = false;
		this.screenMode = {add:false, edit:false};
		this.loadBid(this.item.bid_id);
	  }
	  
	  loadBid(id){
		  var that = this;
		  that.commonService.enduserService.getBid("",id,"")
				.subscribe( data => {
							  if(data.results.length > 0){
									var item = data.results[0];
									that.dynamicFormComponent.generateDisplayField("Bid",item);
									that.imageTemplateComponent.getTransactionThumbnails(item.bid_id);
									that.item = item;
									that.item.transactionTyp = "Bid";
							  }
							  else{
								  alert("No data found.");
							  }
			});
	  }
	  
	  onDeactivate(evt){
		  var that = this;
		  this.sharedService.openMessageBox("C","Are you sure you want to deactivate it?",function(flag){
				that.commonService.enduserService.getBid("",that.item.bid_id,"")
						.subscribe( res => {
									  if(res.results.length > 0){
										  var item = res.results[0];
										  item.active = "-";
										  that.commonService.enduserService.updateBid(item)
											.subscribe( data => {
													if(data.statusCode=="S"){
														alert("Successfully Deactivated.");
														that.sharedService.closeMessageBox();
														that.onBidCancel();
													}
													else{
														alert("Unable to deactivate.");
													}
											});
									  }
						});
		  });
	  }
	  
	reloadItems(){
		//this.loadFavourites();
		this.onBidCancel();
	}
	 
		
}
