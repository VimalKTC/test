//
import {Component, OnInit} from '@angular/core'
import {Router} from '@angular/router';
import { CommonService } from '../common.service';
import { SharedService } from '../shared.service';
declare var jQuery:any;

interface hidden {
  view: boolean,
  add: boolean
}
interface newItem {
	subscription_id: string,
	app_id: string,
	role_id: string,
	screen: string,
	applicable: boolean,
	field: string,
	field_type: string,
	field_path: string,
	field_source: string,
	field_required: boolean,
	field_category: string,
	field_sequence: string,
	field_for_filter: boolean,
	field_from_config: boolean,
	create: boolean,
	edit: boolean,
	delete: boolean,
	visible: boolean,
	editable: boolean,
	editMode: boolean,
	createdBy: string,
	createdAt: string,
	changedBy: string,
	changedAt: string,
	deleted: boolean
}

@Component({
    selector: 'field-mapping',
    templateUrl: './fieldMappingAdmin.component.html',
   styleUrls: ['./fieldMappingAdmin.component.css'],
   providers: [CommonService]
})
export class AppFieldMappingAdmin implements OnInit {
	router: Router;
	app_id: string = "";
	screen: string = "";
	role_id: string = "";
	editMode: boolean = false;
	hidden: hidden;
	newItem: newItem;
	field_right: Array<{
		_id?: string,
		subscription_id: string,
		app_id: string,
		screen: string,
		role_id: string;
		applicable: boolean,
		field: string,
		field_type: string,
		field_path: string,
		field_source: string,
		field_required: boolean,
		field_category: string,
		field_sequence: string,
		field_for_filter: boolean,
		field_from_config: boolean,
		create: boolean,
		edit: boolean,
		delete: boolean,
		visible: boolean,
		editable: boolean,
		editMode: boolean,
		createdBy: string,
		createdAt: string,
		changedBy: string,
		changedAt: string,
		deleted: boolean
	}>;
	roles: Array<{
		_id?: string,
		role_id: string,
		role_name: string
	}>;
	applications: Array<{
		_id?: string,
		app_id: string,
		app_name: string,
		deleted: boolean,
		createdBy: string,
		createdAt: string,
		changedBy: string,
		changedAt: string
	}>;
	screens: Array<{
		_id?: string,
		screen: string
	}>;
	fields: Array<{
		_id?: string,
		field: string,
		type: string,
		path: string,
		source: string,
		required: boolean,
		category: string,
		sequence: string,
		for_filter: boolean,
		from_config: boolean
	}>;
	selectedField: any;
	
	constructor(private commonService: CommonService, private sharedService: SharedService, router: Router) { 
	this.router = router;
  }
  
	ngOnInit() {
		//this.sharedService.sharedObj.containerContext.title = "Field Mappings";
		this.hidden = {view: false, add: true};
		this.newItem = {
						subscription_id: "-",
						app_id: "",
						role_id: "",
						screen: "",
						applicable: false,
						field: "",
						field_type: "",
						field_path: "",
						field_source: "",
						field_required: false,
						field_category: "",
						field_sequence: "",
						field_for_filter: false,
						field_from_config: false,
						create: false,
						edit: false,
						delete: false,
						visible: false,
						editable: false,
						editMode: false,
						createdBy: "",
						createdAt: "",
						changedBy: "",
						changedAt: "",
						deleted: false
						};
		this.commonService.adminService.getRole(this.role_id)
		  .subscribe( roles => {
			  this.roles = roles.results;
				this.commonService.adminService.getApplication(this.app_id)
				  .subscribe( applications => {
					  this.applications = applications.results;
					  this.commonService.adminService.getScreen()
						.subscribe( screens => {
							  this.screens = screens.results;
							  if(this.roles.length > 0){
								this.role_id = this.roles[0].role_id;
							  }
							  if(this.applications.length > 0){
								this.app_id = this.applications[0].app_id;
							  }
							  if(this.screens.length > 0){
								this.screen = this.screens[0].screen;
							  }
							  this.loadFieldMappings();
							  /*this.commonService.adminService.getFieldRights(this.role_id,this.app_id,this.screen)
								.subscribe( fields => {
									this.field_right = fields.results;
									this.field_right.sort((a: any, b: any)=> {return a.field_sequence - b.field_sequence;});//ascending sort
								});*/
							
						});			  
				  });
		  });
		
	  	  
  }
  
  
  loadFieldMappings(){
	  var that = this;
	  this.field_right = [];
	  this.commonService.adminService.getFieldRights(this.role_id,this.app_id,this.screen)
		.subscribe( field_rights => {
			  this.commonService.adminService.getField()
				  .subscribe( fields => {
					  //that.screens = screens.results
					  jQuery.each(fields.results,function(i,v){
						  var entry:any = {
								subscription_id: '-',
								role_id: that.role_id,
								app_id: that.app_id,
								screen: that.screen,
								screen_sequence: "",
								screen_for_nav: false,
								applicable: false,
								field: v.field,
								field_type: v.type,
								field_path: v.path,
								field_source: v.source,
								field_required: v.required,
								field_category: v.category,
								field_sequence: "",
								field_for_filter: v.for_filter,
								field_from_config: v.from_config,
								create: false,
								edit: false,
								delete: false,
								visible: false,
								editable: false,
								editMode: false,
								deleted: v.deleted
							  };
						  jQuery.each(field_rights.results,function(indx,val){							  
							  if(val.field === v.field){
								entry = jQuery.extend(true, {}, val);
							  }							  
						  });
						  that.field_right.push(entry);
					  });
					  this.field_right.sort((a: any, b: any)=> {return a.field_sequence - b.field_sequence;});//ascending sort
				});
		});
  }
  
  
  
  
  onEdit(evt,field){
	  field.editMode = true;
	  this.editMode = true;
  }
  
  onCancel(evt){
	  this.loadFieldMappings();
	  this.editMode = false;
	  jQuery.each(this.field_right,function(i,v){
		  v.editMode = false;
	  });
  }
  
   moveUp(evt,field,indx){ 
	 if(this.field_right[indx - 1]){
		 var above = this.field_right[indx - 1].field_sequence;
		 var below = this.field_right[indx].field_sequence;
		 if(above && below){
			 this.field_right[indx - 1].field_sequence = below;
			 this.field_right[indx].field_sequence = above;
			 this.field_right.sort((a: any, b: any)=> {return a.field_sequence - b.field_sequence;});//ascending sort
		 }
	 }
  }
  
  moveDown(evt,field,indx){	 
	 if(this.field_right[indx - (-1)]){
		 var above = this.field_right[indx].field_sequence;
		 var below = this.field_right[indx - (-1)].field_sequence;
		 if(above && below){
			 this.field_right[indx].field_sequence = below;
			 this.field_right[indx - (-1)].field_sequence = above;
			 this.field_right.sort((a: any, b: any)=> {return a.field_sequence - b.field_sequence;});//ascending sort
		 }
	 }
  }
  
  onDelete(evt,doc){
	  var that = this;
	   
	  doc.deleted = true;
	  this.commonService.adminService.updateRights(doc)
		   .subscribe( data => {	
		    
			if(data.statusCode=="S"){
				this.onAddCancel("");
			}
			else{
				alert("Unable to delete");
			}		  
		  }); 
  }
  
  onSaveChanges(evt){
	  var that = this;
	  var doc = [];
	  var max_sequence:any = this.field_right[this.field_right.length - 1].field_sequence;
	  jQuery.each(that.field_right,function(i,v){
		  if(v._id || v.visible){
			 if(!(v.field_sequence)){
				v.field_sequence = (max_sequence - (-1)).toString();
				max_sequence = max_sequence - (-1);
			 }
			 doc.push(v); 
		  }
	  });
	  this.commonService.adminService.updateMultiRights({rights: doc})
		   .subscribe( data => {	
		    
			if(data.error){
				alert("Unable to save");
			}
			else{
				this.onCancel("");
			}		  
		  });
  }
  
  onRoleChange(selected){
	  this.role_id = selected;
	  this.loadFieldMappings();
	  /*this.commonService.adminService.getFieldRights(selected,this.app_id,this.screen)
		  .subscribe( fields => {
				this.field_right = fields.results;
				this.field_right.sort((a: any, b: any)=>{return a.field_sequence - b.field_sequence;});//ascending sort
		  });*/
  }
  onAppChange(selected){
	  this.app_id = selected;
	  this.loadFieldMappings();
	  /*this.commonService.adminService.getFieldRights(this.role_id,selected,this.screen)
		  .subscribe( fields => {
				this.field_right = fields.results;
				this.field_right.sort((a: any, b: any)=>{return a.field_sequence - b.field_sequence;});//ascending sort
		  });*/
  }
  onScreenChange(selected){
	  this.screen = selected;
	  this.loadFieldMappings();
	  /*this.commonService.adminService.getFieldRights(this.role_id,this.app_id,selected)
		  .subscribe( fields => {
				this.field_right = fields.results;
				this.field_right.sort((a: any, b: any)=> {return a.field_sequence - b.field_sequence;});//ascending sort
		  });*/
  }
  
  onAddField(evt){
	 this.hidden.view = true;
	  this.hidden.add = false;
	  this.commonService.adminService.getField()
				.subscribe( fields => 
					  this.fields = fields.results);
	this.newItem = {
						subscription_id: "-",
						app_id: "",
						role_id: "",
						screen: "",
						applicable: false,
						field: "",
						field_type: "",
						field_path: "",
						field_source: "",
						field_required: false,
						field_category: "",
						field_sequence: "",
						field_for_filter: false,
						field_from_config: false,
						create: false,
						edit: false,
						delete: false,
						visible: false,
						editable: false,
						editMode: false,
						createdBy: "",
						createdAt: "",
						changedBy: "",
						changedAt: "",
						deleted: false
						};
	this.selectedField = {};
  }
  
  
  onAddSave(evt){
	  this.commonService.adminService.getFieldRights(this.newItem.role_id,this.newItem.app_id,this.newItem.screen)
		  .subscribe( fields => {
			  var field_right = fields.results;
			  this.newItem.field_sequence = '0';
			  if(field_right.length > 0){
				  field_right.sort((a: any, b: any)=> {return b.field_sequence - a.field_sequence;});//descending sort
				  this.newItem.field_sequence = (field_right[0].field_sequence - (-1)).toString();
			  }
			  this.commonService.adminService.addRights(this.newItem)
			   .subscribe( data => {				
					if(data.statusCode=="S"){
						this.onAddCancel("");
					}
					else{
						alert("Unable to save");
					}		  
			  });
		  });
	  
  }
  onAddCancel(evt){
	  this.hidden.view = false;
	  this.hidden.add = true;
	  this.loadFieldMappings();
	  /*this.commonService.adminService.getFieldRights(this.role_id,this.app_id,this.screen)
		  .subscribe( fields => {
				this.field_right = fields.results;
				this.field_right.sort((a: any, b: any)=> {return a.field_sequence - b.field_sequence;});//ascending sort
		  });*/
  }
  onSelectAll(evt){
	  this.editMode = true;
	  
	  for(var i = 0; i<this.field_right.length; i++){
		 this.field_right[i].visible = true;
		 this.field_right[i].editable = true;
		 this.field_right[i].editMode = true;
	  }
  }
  
  onFieldSelect(evt){
	  var selected = this.selectedField;
	  this.newItem.field = selected.field;
	  this.newItem.field_type = selected.type;
	  this.newItem.field_path = selected.path;
	  this.newItem.field_source = selected.source;
	  this.newItem.field_required = selected.required;
	  this.newItem.field_category = selected.category;
	  //this.newItem.field_sequence = selected.sequence;
	  this.newItem.field_for_filter = selected.for_filter;
	  this.newItem.field_from_config = selected.from_config;
  }
  
 
  
}
