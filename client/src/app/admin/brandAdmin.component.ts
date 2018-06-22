//
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { CommonService } from '../common.service';
import { SharedService } from '../shared.service';

interface hidden {
  view: boolean,
  add: boolean
}
interface disabled {
  brand_id: boolean,
  brand_name: boolean
}
interface newItem {
	brand_id: string, 
	brand_name: string,
	changedAt: string,
	changedBy: string,
	createdAt: string,
	createdBy: string,
	deleted: boolean
}


@Component({
    //selector: 'app-root',
    templateUrl: './brandAdmin.component.html',
   styleUrls: ['./brandAdmin.component.css'],
   providers: [CommonService]
})
export class AppBrandAdmin implements OnInit {
	router: Router;
	hidden: hidden;
	disabled: disabled;
	newItem: newItem;
	editMode: boolean = false;
	brands: Array<{
		_id?: string,
		brand_id: string,
		brand_name: string
	}>;
	
	constructor(private commonService: CommonService, private sharedService: SharedService, router: Router) { 
		this.router = router;
	  }
  
	ngOnInit() {
		this.sharedService.sharedObj.containerContext.title = "Brand";
		this.hidden = {view: false, add: true};
		this.disabled = {brand_id: true, brand_name: false};
		this.newItem = {
						brand_id:"", 
						brand_name:"",
						changedAt:"",
						changedBy:"",
						createdAt:"00/00/0000",
						createdBy:"",
						deleted:false
						};
	  	this.commonService.adminService.getBrand("")
		  .subscribe( brands => this.brands = brands.results);
  }
  onAddClick(evt){
	  this.hidden.view = true;
	  this.hidden.add = false;
	  this.disabled.brand_name = false;
	  this.editMode = false;
	  this.newItem = {
						brand_id:"", 
						brand_name:"",
						changedAt:"",
						changedBy:"",
						createdAt:"00/00/0000",
						createdBy:"",
						deleted:false
						};
  }
  onAddCancel(evt){
	  this.hidden.view = false;
	  this.hidden.add = true;
	  this.commonService.adminService.getBrand("")
		  .subscribe( brands => this.brands = brands.results);
  }
  
  onSave(evt){
		if(this.editMode)
			this.onEditSave(evt)
		else
			this.onAddSave(evt);
	}
	  
  onAddSave(evt){
	  this.commonService.adminService.addBrand(this.newItem)
		   .subscribe( data => {	
		    
			if(data.statusCode=="S"){
				this.onAddCancel("");
			}
			else{
				alert("Unable to save");
			}		  
		  });
  }
  onEditSave(evt){
	  this.commonService.adminService.updateBrand(this.newItem)
		   .subscribe( data => {	
		    
			if(data.statusCode=="S"){
				this.onAddCancel("");
			}
			else{
				alert("Unable to update");
			}		  
		  });
  }
  onBrandClick(evt,obj){
	  this.hidden.view = true;
	  this.hidden.add = false;	  
	  this.disabled.brand_name = true;
	  this.newItem = obj;
  }
  onEdit(evt,doc){
	  this.hidden.view = true;
	  this.hidden.add = false;	  
	  this.disabled.brand_name = false;
	  this.editMode = true;
	  this.newItem = doc;
  }
  onDelete(evt,doc){
	  var that = this;
	   
	  doc.deleted = true;
	  this.commonService.adminService.updateBrand(doc)
		   .subscribe( data => {	
		    
			if(data.statusCode=="S"){
				this.onAddCancel("");
			}
			else{
				alert("Unable to delete");
			}		  
		  }); 
  }
}
