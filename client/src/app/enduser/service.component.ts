//
import {Component,OnInit,ElementRef,ViewChild} from '@angular/core';
import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Router, ActivatedRoute} from '@angular/router';
import { CommonService } from '../common.service';
import { SharedService } from '../shared.service';
import { AppServiceForm } from './reusable/serviceForm.component';
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
      templateUrl: './service.component.html',
      styleUrls: ['./service.component.css'],
      providers: [CommonService]
})

@Injectable()
export class AppService implements OnInit {
		localData: any;
		item: any = {};
		image_item: any;
		hidden: any;
		disabled: any;
		userDetail: any = {};
		showListDialog: boolean = false;
		showProductListDialog: boolean = false;
		showProductTypeListDialog: boolean = false;
		//showBrandListDialog: boolean = false;
		productTypes: any = [];
		//brands: any = [];
		products: any = [];
		fields: any = [];
		screenConfig: any = {};
		selectedPrdTyp: string = "";
		self: any = this;
		editMode: boolean = true;
		detail: boolean = false;
		results: any = [];
		screenMode: any = {add:false, edit:false};
		@ViewChild(AppServiceForm) serviceFormComponent: AppServiceForm;
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
							that.commonService.enduserService.getService("",id,"")
							  .subscribe( data => {
								  if(data.results.length > 0){
									var item = data.results[0];
									that.detail = true;
									that.editMode = false;
									that.screenMode = {add:false, edit:false};
									that.serviceFormComponent.loadService(item);
									that.imageTemplateComponent.getTransactionThumbnails(item.service_id);
									that.item = item;
									that.item.transactionTyp = "Service";
								  }
								  else{
									  alert("No data found.");
								  }
								});
						}
						else{
							that.commonService.enduserService.getService(that.userDetail.user_id,"","")
							  .subscribe( data => {
								  that.results = data.results;
								  jQuery.each(that.results,function(i,v){
										that.getResultImage(v);
									});
							});
						}						
					}
				});
				this.sharedService.sharedObj.containerContext.title = "Services";				
      }
	  
	  getResultImage(item){
		  this.commonService.enduserService.getImage(this.userDetail.user_id,"",item.service_id)
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
		  this.item = {};
			this.commonService.adminService.getProductType("")
				.subscribe( productTypes => this.productTypes = productTypes.results);		
			this.showListDialog = true;
			this.showProductTypeListDialog = true;  
	  }
	  
	  openItem(item){
		this.detail = true;
		this.editMode = false;
		this.screenMode = {add:false, edit:false};
		this.item = item;
		this.serviceFormComponent.loadService(item);
		this.imageTemplateComponent.getTransactionThumbnails(item.service_id);
		
		this.item.transactionTyp = "Service";
	  }
	  
	  onPrdTypSelect(evt,prdTyp){
			this.selectedPrdTyp = prdTyp.product_type_id;
			this.commonService.adminService.getServiceProduct(this.selectedPrdTyp)
				.subscribe( service => {
					this.products = service.results;
				});
			
			this.showProductTypeListDialog = false;
			this.showProductListDialog = true;
			//this.showBrandListDialog = true;
	  }
	 	  
	  
	  onPrdSelect(evt,prd){
		  this.item.product_id = prd.product_id;
		  this.item.product_type_id = prd.product_type_id;
		  this.item.product_type_name = prd.product_type_name;
		  this.item.brand_id = prd.brand_id;
		  this.item.brand_name = prd.brand_name;
		  this.item.model = prd.model;
		  this.item.transactionTyp = "Service";
		  this.showProductListDialog = false;
		  this.showListDialog = false;
		  
		this.serviceFormComponent.loadService(this.item);
		this.detail = true;
		this.editMode = true;
		this.screenMode = {add:true, edit:false};
		this.imageTemplateComponent.getThumbnails(prd.product_id);		
	  }
	  
	  	  
	  save(saveItem){
			saveItem.user_id = this.userDetail.user_id;
			saveItem.name = this.userDetail.name;
			saveItem.mobile = this.userDetail.mobile;
			saveItem.number_of_image = this.imageTemplateComponent.item.number_of_image;
			var that = this;
			if(saveItem.service_id){//Edit an existing Service
				this.commonService.enduserService.updateService(saveItem)
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
									image.transaction_id = saveItem.service_id;
									image.name = image_name;
									image.user_id = that.userDetail.user_id;
									that.commonService.enduserService.addImage(image)
									   .subscribe( res_image => {							
										if(res_image.statusCode=="S"){
											//Upload Thumbnail
											v.transaction_id = saveItem.service_id;
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
			else{//Create New Service
				this.commonService.enduserService.addService(saveItem)
				  .subscribe( data => {	
				   //debugger;
					if(data.statusCode=="S"){
						//Upload Image
						jQuery.each(this.imageTemplateComponent.thumbnails, function(i,v){
							//if(v.newImage){								
									var image_name = "";
									var image = that.imageTemplateComponent.newImages[v.newImageLink]
									image.transaction_id = data.result.service_id;
									image.name = image_name;
									image.user_id = that.userDetail.user_id;
									that.commonService.enduserService.addImage(image)
									   .subscribe( res_image => {							
										if(res_image.statusCode=="S"){
											//Upload Thumbnail
											v.transaction_id = data.result.service_id;
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
												that.onServiceCancel();
											  });
											
										}
										else{
											alert("Unable to save image.");
											that.onServiceCancel();
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
	  
	  onServiceSave(){
		var saveItem = this.serviceFormComponent.serviceItem;
		this.save(saveItem);  
	  }
	  
	  onServiceCancel(){
		  var that = this;
		  this.commonService.enduserService.getService(this.userDetail.user_id,"","")
							  .subscribe( data => {
								  that.results = data.results;
								  jQuery.each(that.results,function(i,v){
										that.getResultImage(v);
									});
							});
		  this.detail = false;
		  this.screenMode = {add:false, edit:false};
	  }
	  
	  
	  onEdit(evt){
		this.detail = true;
		this.editMode = true;
		this.screenMode = {add:false, edit:true};
		
		this.imageTemplateComponent.getTransactionThumbnails(this.item.service_id);
	  }
	  
	  onEditCancel(evt){
		this.detail = true;
		this.editMode = false;
		this.screenMode = {add:false, edit:false};
		this.loadService(this.item.service_id);
	  }
	  
	  loadService(id){
		  var that = this;
		  that.commonService.enduserService.getService("",id,"")
				.subscribe( data => {
							  if(data.results.length > 0){
									var item = data.results[0];
									
									that.imageTemplateComponent.getTransactionThumbnails(item.service_id);
									that.item = item;
									that.item.transactionTyp = "Service";
							  }
							  else{
								  alert("No data found.");
							  }
			});
	  }
	  
	  onDeactivate(evt){
		  var that = this;
		  this.sharedService.openMessageBox("C","Are you sure you want to deactivate it?",function(flag){
				that.commonService.enduserService.getService("",that.item.service_id,"")
					.subscribe( res => {
							  if(res.results.length > 0){
								  var item = res.results[0];
								  item.active = "-";
								  that.commonService.enduserService.updateService(item)
									.subscribe( data => {
											if(data.statusCode=="S"){
												alert("Successfully Deactivated.");
												that.sharedService.closeMessageBox();
												that.onServiceCancel();
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
		this.onServiceCancel();
	}
		
}
