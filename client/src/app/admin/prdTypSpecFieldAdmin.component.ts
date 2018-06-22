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
  id: boolean,
  name: boolean
}
interface newItem {
	product_type_id: string, 
	product_type_name: string,
	specification_field_id: string,
	specification_field_name: string,
	changedAt: string,
	changedBy: string,
	createdAt: string,
	createdBy: string,
	deleted: boolean
}


@Component({
    //selector: 'app-root',
    templateUrl: './prdTypSpecFieldAdmin.component.html',
   styleUrls: ['./prdTypSpecFieldAdmin.component.css'],
   providers: [CommonService]
})
export class AppPrdTypSpecFieldMapAdmin implements OnInit {
	router: Router;
	hidden: hidden;
	disabled: disabled;
	newItem: newItem;
	editMode: boolean = false;
	prdTypSpecFields: Array<{
		_id?: string,
		product_type_id: string, 
		product_type_name: string,
		specification_field_id: string,
		specification_field_name: string
	}>;
	productTypes: Array<{
		_id?: string,
		product_type_id: string,
		product_type_name: string
	}>;
	specificationFields: Array<{
		_id?: string,
		specification_field_id: string,
		specification_field_name: string
	}>;
	
	constructor(private commonService: CommonService, private sharedService: SharedService, router: Router) { 
	this.router = router;
  }
  
	ngOnInit() {
		this.sharedService.sharedObj.containerContext.title = "Product Type & Specification Mapping";
		this.commonService.adminService.getProductType("")
		  .subscribe( productTypes => {
			  this.productTypes = productTypes.results;
			  if(this.productTypes.length > 0){ 
				  this.commonService.adminService.getPrdTypSpecFieldMap(this.productTypes[0].product_type_id)
				  .subscribe( prdTypSpecFields => this.prdTypSpecFields = prdTypSpecFields.results);
				}
		  });
		this.commonService.adminService.getSpecification("")
		  .subscribe( specificationFields => this.specificationFields = specificationFields.results);
		this.hidden = {view: false, add: true};
		this.disabled = {id: true, name: false};
		this.newItem = {
						product_type_id: '', 
						product_type_name: '',
						specification_field_id: '',
						specification_field_name: '',
						changedAt:"",
						changedBy:"",
						createdAt:"00/00/0000",
						createdBy:"",
						deleted:false
						};
		
  }
  onAddClick(evt){
	  this.hidden.view = true;
	  this.hidden.add = false;
	  this.disabled.name = false;
	  this.editMode = false;
	  this.newItem = {
						product_type_id: '', 
						product_type_name: '',
						specification_field_id: '',
						specification_field_name: '',
						changedAt:"",
						changedBy:"",
						createdAt:"00/00/0000",
						createdBy:"",
						deleted:false
						};
	if(this.productTypes[0]){
		this.newItem.product_type_id = this.productTypes[0].product_type_id;
		this.newItem.product_type_name = this.productTypes[0].product_type_name;
	}
	if(this.specificationFields[0]){
		this.newItem.specification_field_id = this.specificationFields[0].specification_field_id;
		this.newItem.specification_field_name = this.specificationFields[0].specification_field_name;
	}
  }
  onAddCancel(evt){
	  this.hidden.view = false;
	  this.hidden.add = true;
	  this.commonService.adminService.getPrdTypSpecFieldMap("")
		  .subscribe( prdTypSpecFields => this.prdTypSpecFields = prdTypSpecFields.results);
  }
  
  onSave(evt){
		if(this.editMode)
			this.onEditSave(evt)
		else
			this.onAddSave(evt);
	  }
  onAddSave(evt){
	  this.commonService.adminService.addPrdTypSpecFieldMap(this.newItem)
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
	  this.commonService.adminService.updatePrdTypSpecFieldMap(this.newItem)
		   .subscribe( data => {	
		    
			if(data.statusCode=="S"){
				this.onAddCancel("");
			}
			else{
				alert("Unable to update");
			}		  
		  });
  }
  
  onEdit(evt,doc){
	this.hidden.view = true;
	this.hidden.add = false;
	this.disabled.name = false; 
	this.editMode = true;
	this.newItem = doc;
  }
  
  onDelete(evt,doc){
	  var that = this;
	  doc.deleted = true;
	  this.commonService.adminService.updatePrdTypSpecFieldMap(doc)
		   .subscribe( data => {
			if(data.statusCode=="S"){
				this.onAddCancel("");
			}
			else{
				alert("Unable to delete");
			}		  
		  }); 
  }
	onProductTypeChange(val){
		this.commonService.adminService.getPrdTypSpecFieldMap(val)
			  .subscribe( prdTypSpecFields => this.prdTypSpecFields = prdTypSpecFields.results);
	}
  
  onPrdTypSet(evt){
	 this.newItem.product_type_id = evt.target.value;
	 this.newItem.product_type_name = evt.target.selectedOptions[0].innerText;
  }
  
  onSpecFieldSet(evt){
	  this.newItem.specification_field_id = evt.target.value;
	  this.newItem.specification_field_name = evt.target.selectedOptions[0].innerText;
  }
  
}
