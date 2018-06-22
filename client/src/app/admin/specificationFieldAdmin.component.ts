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
  specification_field_id: boolean,
  specification_field_name: boolean
}
interface newItem {
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
    templateUrl: './specificationFieldAdmin.component.html',
   styleUrls: ['./specificationFieldAdmin.component.css'],
   providers: [CommonService]
})
export class AppSpecificationFieldAdmin implements OnInit {
	router: Router;
	hidden: hidden;
	disabled: disabled;
	newItem: newItem;
	editMode: boolean = false;
	specificationFields: Array<{
		_id?: string,
		specification_field_id: string,
		specification_field_name: string
	}>;
	
	constructor(private commonService: CommonService, private sharedService: SharedService, router: Router) { 
	this.router = router;
  }
  
	ngOnInit() {
		this.sharedService.sharedObj.containerContext.title = "Specification Field";
		this.hidden = {view: false, add: true};
		this.disabled = {specification_field_id: true, specification_field_name: false};
		this.newItem = {
						specification_field_id:"", 
						specification_field_name:"",
						changedAt:"",
						changedBy:"",
						createdAt:"00/00/0000",
						createdBy:"",
						deleted:false
						};
	  	  this.commonService.adminService.getSpecification("")
		  .subscribe( specificationFields => this.specificationFields = specificationFields.results);
  }
  onAddClick(evt){
	  this.hidden.view = true;
	  this.hidden.add = false;
	  this.disabled.specification_field_name = false;
	  this.editMode = false;
	  this.newItem = {
						specification_field_id:"", 
						specification_field_name:"",
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
	  this.commonService.adminService.getSpecification("")
		  .subscribe( specificationFields => this.specificationFields = specificationFields.results);
  }
  
  onSave(evt){
		if(this.editMode)
			this.onEditSave(evt)
		else
			this.onAddSave(evt);
	  }
  onAddSave(evt){
	  this.commonService.adminService.addSpecification(this.newItem)
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
	  this.commonService.adminService.updateSpecification(this.newItem)
		   .subscribe( data => {	
		    
			if(data.statusCode=="S"){
				this.onAddCancel("");
			}
			else{
				alert("Unable to update");
			}		  
		  });
  }
  onSpecFieldClick(evt,obj){
	  this.hidden.view = true;
	  this.hidden.add = false;	  
	  this.disabled.specification_field_name = true;
	  this.newItem = obj;
  }
  onEdit(evt,doc){
	  this.hidden.view = true;
	  this.hidden.add = false;	  
	  this.disabled.specification_field_name = false;
	  this.editMode = true;
	  this.newItem = doc;
  }
  onDelete(evt,doc){
	  var that = this;
	  doc.deleted = true;
	  this.commonService.adminService.updateSpecification(doc)
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
