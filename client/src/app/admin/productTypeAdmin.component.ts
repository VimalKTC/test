//
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { CommonService } from '../common.service';
import { SharedService } from '../shared.service';

interface hidden {
  view: boolean,
  add: boolean,
  spec: boolean
}
interface disabled {
  product_type_id: boolean,
  product_type_name: boolean
}
interface newItem {
	product_type_id: string, 
	product_type_name: string,
	changedAt: string,
	changedBy: string,
	createdAt: string,
	createdBy: string,
	deleted: boolean
}


@Component({
    //selector: 'app-root',
    templateUrl: './productTypeAdmin.component.html',
   styleUrls: ['./productTypeAdmin.component.css'],
   providers: [CommonService]
})
export class AppProductTypeAdmin implements OnInit {
	router: Router;
	hidden: hidden;
	disabled: disabled;
	newItem: newItem;
	editMode: boolean = false;
	selectedPrdTyp: any = {};
	productTypes: Array<{
		_id?: string,
		product_type_id: string,
		product_type_name: string
	}>;
	prdTypSpecFields: Array<{
		_id?: string,
		product_type_id: string, 
		product_type_name: string,
		specification_field_id: string,
		specification_field_name: string
	}>;
	specFields: Array<{
		_id?: string,
		specification_field_id: string,
		specification_field_name: string
	}>;
	showMapSpecDialog: boolean = false;
	
	constructor(private commonService: CommonService, private sharedService: SharedService, router: Router) { 
	this.router = router;
  }
  
	ngOnInit() {
		this.sharedService.sharedObj.containerContext.title = "Product Type";
		this.hidden = {view: false, add: true, spec: true};
		this.disabled = {product_type_id: true, product_type_name: false};
		this.newItem = {
						product_type_id:"", 
						product_type_name:"",
						changedAt:"",
						changedBy:"",
						createdAt:"00/00/0000",
						createdBy:"",
						deleted:false
						};
	  	  this.commonService.adminService.getProductType("")
		  .subscribe( productTypes => this.productTypes = productTypes.results);
  }
  onAddClick(evt){
	  this.hidden.view = true;
	  this.hidden.add = false;
	  this.hidden.spec = true;
	  this.disabled.product_type_name = false;
	  this.editMode = false;
	  this.newItem = {
						product_type_id:"", 
						product_type_name:"",
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
	  this.hidden.spec = true;
	  this.commonService.adminService.getProductType("")
		  .subscribe( productTypes => this.productTypes = productTypes.results);
  }
  
  onSave(evt){
	  if(this.editMode)
			this.onEditSave(evt)
		else
			this.onAddSave(evt);
  }
  onAddSave(evt){
	  this.commonService.adminService.addProductType(this.newItem)
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
	  var that = this;
	  this.commonService.adminService.updateProductType(this.newItem)
		   .subscribe( data => {	
		    
			if(data.statusCode=="S"){
				this.onAddCancel("");
			}
			else{
				alert("Unable to update");
			}		  
		  }); 
  }
  
  onPrdTypClick(evt,obj){
	  this.hidden.view = true;
	  this.hidden.add = false;	
	  this.hidden.spec = true;
	  this.disabled.product_type_name = true;
	  this.newItem = obj;
  }
  onEdit(evt,doc){
	  this.hidden.view = true;
	  this.hidden.add = false;	
	  this.hidden.spec = true;
	  this.disabled.product_type_name = false;
	  this.editMode = true;
	  this.newItem = doc;
  }
  onDelete(evt,doc){
	  var that = this;
	   
	  doc.deleted = true;
	  this.commonService.adminService.updateProductType(doc)
		   .subscribe( data => {	
		    
			if(data.statusCode=="S"){
				this.onAddCancel("");
			}
			else{
				alert("Unable to delete");
			}		  
		  }); 
  }
  
  onSpecFieldMapping(evt, prdTyp){
	  this.selectedPrdTyp = prdTyp;
	  this.hidden.view = true;
	  this.hidden.add = true;	
	  this.hidden.spec = false;
	  this.commonService.adminService.getPrdTypSpecFieldMap(prdTyp.product_type_id)
		.subscribe( prdTypSpecFields => {
			this.prdTypSpecFields = prdTypSpecFields.results;
		});
  }
  
  onAddSpec(evt){
	  this.commonService.adminService.getSpecification("")
		  .subscribe( specificationFields => this.specFields = specificationFields.results);
	  this.showMapSpecDialog = true;
  }
  
  onSpecFieldSelect(evt,specField){
	  var saveItem:any = {
						product_type_id: this.selectedPrdTyp.product_type_id, 
						product_type_name: this.selectedPrdTyp.product_type_name,
						specification_field_id: specField.specification_field_id,
						specification_field_name: specField.specification_field_name,
						changedAt:"",
						changedBy:"",
						createdAt:"00/00/0000",
						createdBy:"",
						deleted:false
						};
	  this.commonService.adminService.addPrdTypSpecFieldMap(saveItem)
		   .subscribe( data => {		    
			if(data.statusCode=="S"){
				this.onAddSpecCancel("");
			}
			else{
				alert("Unable to save");
			}		  
		  });
	  this.showMapSpecDialog = false;
  }
  
  onSpecDelete(evt,doc){
	  var that = this;
	  doc.deleted = true;
	  this.commonService.adminService.updatePrdTypSpecFieldMap(doc)
		   .subscribe( data => {
			if(data.statusCode=="S"){
				this.onAddSpecCancel("");
			}
			else{
				alert("Unable to delete");
			}		  
		  }); 
  }
  
  onAddSpecCancel(evt){
	  this.hidden.view = true;
	  this.hidden.add = true;	
	  this.hidden.spec = false;
	  this.commonService.adminService.getPrdTypSpecFieldMap(this.selectedPrdTyp.product_type_id)
		.subscribe( prdTypSpecFields => {
			this.prdTypSpecFields = prdTypSpecFields.results;
		});
  }
  
}
