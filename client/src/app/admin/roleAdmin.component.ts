//
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { AppScreenMappingAdmin } from './screenMappingAdmin.component';
import { AppFieldMappingAdmin } from './fieldMappingAdmin.component';
import { CommonService } from '../common.service';
import { SharedService } from '../shared.service';

interface hidden {
  view: boolean,
  add: boolean
}
interface disabled {
  role_id: boolean,
  role_name: boolean
}
interface newItem {
	role_id: string, 
	role_name: string
}


@Component({
    //selector: 'app-root',
    templateUrl: './roleAdmin.component.html',
   styleUrls: ['./roleAdmin.component.css'],
   providers: [CommonService]
})
export class AppRoleAdmin implements OnInit {
	router: Router;
	hidden: hidden;
	disabled: disabled;
	newItem: newItem;
	editMode: boolean = false;
	roles: Array<{
		_id?: string,
		role_id: string,
		role_name: string
	}>;
	
	constructor(private commonService: CommonService, private sharedService: SharedService, router: Router) { 
	this.router = router;
  }
  
	ngOnInit() {
		this.sharedService.sharedObj.containerContext.title = "Role";
		this.hidden = {view: false, add: true};
		this.disabled = {role_id: true, role_name: false};
		this.newItem = {
						role_id:"", 
						role_name:""
						};
	  	  this.commonService.adminService.getRole("")
		  .subscribe( roles => this.roles = roles.results);
  }
  onAddClick(evt){
	  this.hidden.view = true;
	  this.hidden.add = false;
	  this.disabled.role_name = false;
	  this.editMode = false;
	  this.newItem = {
						role_id:"", 
						role_name:""
						};
  }
  onAddCancel(evt){
	  this.hidden.view = false;
	  this.hidden.add = true;
	  this.commonService.adminService.getRole("")
		  .subscribe( roles => this.roles = roles.results);
  }
  
  onSave(evt){
		if(this.editMode)
			this.onEditSave(evt)
		else
			this.onAddSave(evt);
	  }
  onAddSave(evt){
	  this.commonService.adminService.addRole(this.newItem)
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
	  this.commonService.adminService.updateRole(this.newItem)
		   .subscribe( data => {	
		    
			if(data.statusCode=="S"){
				this.onAddCancel("");
			}
			else{
				alert("Unable to update");
			}		  
		  });
  }
  onRoleClick(evt,obj){
	  this.hidden.view = true;
	  this.hidden.add = false;	  
	  this.disabled.role_name = true;
	  this.newItem = obj;
  }
  onEdit(evt,doc){
	  this.hidden.view = true;
	  this.hidden.add = false;	  
	  this.disabled.role_name = false;
	  this.editMode = true;
	  this.newItem = doc;
  }
  onDelete(evt,doc){
	  var that = this;
	   
	  doc.deleted = true;
	  this.commonService.adminService.updateRole(doc)
		   .subscribe( data => {	
		    
			if(data.statusCode=="S"){
				this.onAddCancel("");
			}
			else{
				alert("Unable to delete");
			}		  
		  });
  }
  
  onTabClick(evt){
	  
  }
  
}
