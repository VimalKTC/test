//
import {Component,OnInit} from '@angular/core';
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
      //selector: 'app-root',
      templateUrl: './alert.component.html',
      styleUrls: ['./alert.component.css'],
      providers: [CommonService]
})

@Injectable()
export class AppAlert implements OnInit {
		alerts: any;
		alertTypes: any;
		userTypes: any;
		productTypes: any;
		brands: any = [];
		models: any = [];
		variants: any = [];
		fuelTypes: any = [];
		cities: any;
		years: any;
		item: any;
		hidden: any;
		disabled: any;
		userDetail: userDetail;
		selectedPrdTyp : string = "";
		selectedBrand: string = "";
		selectedModel: string = "";

      constructor(private router: Router, private http: Http, private commonService: CommonService, private sharedService: SharedService) {
                     this.router = router;
                     var that = this;;
                     this.getJSON().subscribe(data => {
                                           that.alertTypes = data.alertTypes;
                                           that.userTypes = data.listing_by;
                                           that.fuelTypes = data.fuel_type;
                                           
                                           //Generate Years
                                           that.years = [];
                                          var y = data.years.from;
                                           var cy = (new Date()).getFullYear();
                                           if(Number(y) < Number(cy)){
												do {
                                                       that.years.push( {name: y});
                                                       y = y - (- 1);
                                                }
                                                while (y != cy);
                                           }
                                           that.years.push( {name: cy});//Add Current Year
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
				this.sharedService.sharedObj.containerContext.title = "Alert";	
                //this.alerts = [{address:"Koramangala"}];
                this.item = {};

                //this.productTypes = [{name:"Bengaluru"}];
                //this.brands= [{name:"India"}];
                //this.models= [{name:"India"}];
                //this.variants= [{name:"India"}];

                this.hidden = {view: false, add: true};
                this.disabled = {field: false};
				this.sharedService.getUserProfile(function(user){
					that.userDetail = user;
					that.commonService.enduserService.getAlert(that.userDetail.user_id,"")
					.subscribe( result => that.alerts = result.results);
					
					that.commonService.adminService.getLoc('','','','')
						.subscribe( res => {
							that.cities = res.results;
					});
					
					that.commonService.adminService.getProductType("")
						.subscribe( productTypes => {
								that.productTypes = productTypes.results;
								/*that.commonService.adminService.getBrand("")
									.subscribe( brands => {
										that.brands = brands.results;
										var product_type_id = "";
										var brand_id = "";
										if(that.productTypes.length > 0)
											product_type_id = that.productTypes[0].product_type_id;
										if(that.brands.length > 0)
											brand_id = that.brands[0].brand_id;
										////////	
										that.commonService.adminService.getModel(product_type_id,brand_id)
											.subscribe( models => {
												that.models = models.results;
												var model = "";
												if(that.models.length > 0)
													model = that.models[0].model;
												that.commonService.adminService.getVariant(product_type_id,brand_id,model)
													.subscribe( variants => that.variants = variants.results);
											});
									});*/
						});
				});
							
      }
	  
	  onAlertSelect(evt,alert){
		  this.item = alert;
		  this.hidden = {view: true, add: false};
          this.disabled = {field: true};
	  }
	  
	onPrdTypSelect(evt){
		this.item.product_type_name = evt.product_type_name;
		this.selectedPrdTyp = evt.product_type_id;
		//var product_type_id = this.item.product_type_id;
		//var brand_id = this.item.brand_id;
		//var model = this.item.model;
		//var variant = this.item.variant;
		this.brands = [];
		this.models = [];
		this.variants = [];
		/*this.commonService.adminService.getModel(this.selectedPrdTyp,this.selectedBrand)
			.subscribe( models => {
				this.models = models.results;
			});*/
		//this.commonService.adminService.getVariant(product_type_id,brand_id,model)
			//.subscribe( variants => this.variants = variants.product);
		this.commonService.adminService.getUniqueBrandBasedOnPrdTyp(this.selectedPrdTyp)
			.subscribe( brands => {
							this.brands = brands.results;
		});
	}
	onBrandSelect(evt){
		this.item.brand_name = evt;
		this.selectedBrand = evt;
		//var product_type_id = this.item.product_type_id;
		//var brand_id = this.item.brand_id;
		//var model = this.item.model;
		//var variant = this.item.variant;
		this.models = [];
		this.variants = [];
		this.commonService.adminService.getModel(this.selectedPrdTyp,this.selectedBrand)
			.subscribe( models => {
				this.models = models.results;
			});
		//this.commonService.adminService.getVariant(product_type_id,brand_id,model)
			//.subscribe( variants => this.variants = variants.product);
	}
	onModelSelect(evt){
		this.item.model = evt.model;
		this.selectedModel = evt.model
		//var product_type_id = this.item.product_type_id;
		//var brand_id = this.item.brand_id;
		//var model = this.item.model;
		//var variant = this.item.variant;
		this.variants = [];
		//this.commonService.adminService.getModel(product_type_id,brand_id)
		//	.subscribe( models => {
		//		this.models = models.product;
		//	});
		this.commonService.adminService.getVariant(this.selectedPrdTyp,this.selectedBrand,this.selectedModel)
			.subscribe( variants => this.variants = variants.results);
	}

      onAlertAdd(evt){
				this.hidden = {view: true, add: false};
                this.disabled = {field: false};
      }

      onAlertSave(evt){
			this.item.user_id = this.userDetail.user_id;
			this.commonService.enduserService.addAlert(this.item)
				   .subscribe( data => {	
				   debugger;
					if(data.statusCode=="S"){
						this.onAlertSaveCancel("");
					}
					else{
						alert("Unable to save");
					}		  
				  }); 


      }

      onAlertSaveCancel(evt){
             this.hidden = {view: false, add: true};
			 this.commonService.enduserService.getAlert(this.userDetail.user_id,"")
					.subscribe( result => this.alerts = result.results);
      }
	  
	  validatePrice(){
		  if(this.item.price_from && this.item.price_to){
			  var fromValue = (this.item.price_from && !isNaN(this.item.price_from)) ? this.item.price_from : '0';
			  var toValue = (this.item.price_to && !isNaN(this.item.price_to)) ? this.item.price_to : '0';
			  if((toValue - fromValue) < 0){
				  this.item.price_from = '';
				  this.item.price_to = '';
			  }
		  }
	  }
	  
	  validateKM(){
		  if(this.item.km_run_from && this.item.km_run_to){
			  var fromValue = (this.item.km_run_from && !isNaN(this.item.km_run_from)) ? this.item.km_run_from : '0';
			  var toValue = (this.item.km_run_to && !isNaN(this.item.km_run_to)) ? this.item.km_run_to : '0';
			  if((toValue - fromValue) < 0){
				  this.item.km_run_from = '';
				  this.item.km_run_to = '';
			  }
		  }
	  }
	  
	  validateReg(){
		  if(this.item.year_reg_from && this.item.year_reg_to){
			  var fromValue = (this.item.year_reg_from && !isNaN(this.item.year_reg_from)) ? this.item.year_reg_from : '0';
			  var toValue = (this.item.year_reg_to && !isNaN(this.item.year_reg_to)) ? this.item.year_reg_to : '0';
			  if((toValue - fromValue) < 0){
				  this.item.year_reg_from = '';
				  this.item.year_reg_to = '';
			  }
		  }
	  }



}
