//
import {Component,OnInit,ElementRef,ViewChild} from '@angular/core';
import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Router, ActivatedRoute} from '@angular/router';
import { CommonService } from '../common.service';
import { SharedService } from '../shared.service';
import { AppDynamicForm } from './reusable/dynamicForm.component';
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
      templateUrl: './filter.component.html',
      styleUrls: ['./filter.component.css'],
      providers: [CommonService]
})

@Injectable()
export class AppFilter implements OnInit {
		localData: any;
		item: any = [];
		userDetail: any = {};
		showListDialog: boolean = false;
		self: any = this;
		editMode: boolean = true;
		
		@ViewChild(AppDynamicForm) dynamicFormComponent: AppDynamicForm;
		
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
				this.item = [];
                var that = this;                
				this.sharedService.getUserProfile(function(user){
					that.userDetail = user;
					if(that.userDetail.user_id){
						that.commonService.enduserService.getFilter(that.userDetail.user_id)
							  .subscribe( data => {
									that.item = data.results;
									//that.editMode = false;
									that.dynamicFormComponent.showFilterScreen = true;
									that.dynamicFormComponent.generateFilterField("Filter");									
									
								});
											
					}
				});
				this.sharedService.sharedObj.containerContext.title = "Filter";				
      }
	  
	  	  
	  save(saveItem){
			var that = this;
			var sendData:any = {
				user_id: that.userDetail.user_id,
				data: saveItem
			};
			this.commonService.enduserService.addFilter(sendData)
			.subscribe( data => {	
				   //debugger;
					if(data.statusCode=="S"){
						that.loadFilter(that.userDetail.user_id);		
					}
					else{
						//alert("Unable to save");
						that.sharedService.openMessageBox("E",data.msg,null);
					}		  
			});		  
	  }
	  
	  onFilterSave(){
		  var that = this;
		  var fields = this.dynamicFormComponent.fields;
		  var saveItems = [];
		  jQuery.each(fields, function(i,v){
			  if(v.field_type === 'select'){
				var values = v.value;
				jQuery.each(values, function(indx,val){
					var entry:any = {
						user_id: that.userDetail.user_id,
						filter_field: v.field_path,
						filter_value: val,
						deleted: false
					};
					saveItems.push(entry);
				});
			  }
			  else{
					var entry:any = {
						user_id: that.userDetail.user_id,
						filter_field: v.field_path,
						filter_value: v.value,
						deleted: false
					};
					saveItems.push(entry);
			  }
		  });
		  
		  this.save(saveItems);//Object.assign(saveItem, this.item));
	  }
	  
	  /*onFilterCancel(){
		  this.editMode = false;
		  this.loadFilter(this.userDetail.user_id);
	  }
	  
	  onEdit(evt){
		this.editMode = true;
	  }
	  
	  onEditCancel(evt){
		//this.editMode = false;
		//this.loadFilter(this.userDetail.user_id);
	  }*/
	  
	  loadFilter(id){
		  var that = this;
		  this.commonService.enduserService.getFilter(id)
			 .subscribe( data => {				
				that.item = data.results;
				that.sharedService.sharedObj.containerContext.filterItem = data.results;
				that.sharedService.sharedObj.containerContext.checkFilter();
				//that.editMode = false;
				that.dynamicFormComponent.showFilterScreen = true;
				that.dynamicFormComponent.generateFilterField("Filter");
			});
	  }
	  
	  onClearFilter(evt){
		  var that = this;
		  this.sharedService.openMessageBox("C","Are you sure you want to clear all your settings?",function(flag){
				that.commonService.enduserService.deleteMultipleFilter(that.userDetail.user_id)
					.subscribe( data => {							
								that.sharedService.closeMessageBox();
								that.loadFilter(that.userDetail.user_id);
				});
		  });
	  }
	  	  
		
}
