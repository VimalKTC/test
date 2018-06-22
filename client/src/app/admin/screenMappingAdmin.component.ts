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
	screen_for_nav: boolean,
	screen_sequence: string,
	applicable: boolean,
	field: string,
	create: boolean,
	edit: boolean,
	delete: boolean,
	visible: boolean,
	editable: boolean,
	createdBy: string,
	createdAt: string,
	changedBy: string,
	changedAt: string,
	deleted: boolean
}


@Component({
    selector: 'screen-mapping',
    templateUrl: './screenMappingAdmin.component.html',
   styleUrls: ['./screenMappingAdmin.component.css'],
   providers: [CommonService]
})
export class AppScreenMappingAdmin implements OnInit {
	router: Router;
	app_id: string = "";
	role_id: string = "";
	hidden: hidden;
	newItem: newItem;
	editMode: boolean = false;
	screen_right: Array<{
		_id?: string,
		subscription_id: string,
		app_id: string,
		role_id: string,
		screen: string,
		screen_sequence: string,
		screen_for_nav: boolean,
		applicable: boolean,
		field: string,
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
		screen: string,
	}>;
	roles: Array<{
		_id?: string,
		role_id: string,
		role_name: string
	}>;
	
	constructor(private commonService: CommonService, private sharedService: SharedService, router: Router) { 
		this.router = router;
	  }
  
	ngOnInit() {
		//this.sharedService.sharedObj.containerContext.title = "Screen Mapping";
		this.hidden = {view: false, add: true};
		this.newItem = {
						subscription_id: "-",
						app_id: "",
						role_id: "",
						screen: "",
						screen_sequence: "",
						screen_for_nav: true,
						applicable: false,
						field: "-",
						create: false,
						edit: false,
						delete: false,
						visible: false,
						editable: false,
						createdBy: "",
						createdAt: "",
						changedBy: "",
						changedAt: "",
						deleted: false
						};
		
		this.commonService.adminService.getRole(this.role_id)
		  .subscribe( roles => {
			  this.roles = roles.results;
			  if(this.roles.length > 0){
				this.role_id = this.roles[0].role_id;
			  }
			  this.commonService.adminService.getApplication(this.app_id)
			   .subscribe( applications => {
				  this.applications = applications.results;
				  if(this.applications.length > 0){
					this.app_id = this.applications[0].app_id;
				  }
				  this.loadScreenMappings();
				  this.editMode = false;
				  /*this.commonService.adminService.getScrRights(this.role_id,this.app_id)
					.subscribe( screens => {
						this.screen_right = screens.results;
						this.screen_right.sort((a: any, b: any)=> {return a.screen_sequence - b.screen_sequence;});//ascending sort
					});*/
				});
		  });
	  	  
  }
  
  loadScreenMappings(){
	  var that = this;
	  this.screen_right = [];
	  this.commonService.adminService.getScrRights(this.role_id,this.app_id)
		.subscribe( screen_rights => {
			  this.commonService.adminService.getScreen()
				  .subscribe( screens => {
					  //that.screens = screens.results
					  jQuery.each(screens.results,function(i,v){
						  var entry:any = {
								//subscription_id: req.body.subscription_id,
								role_id: that.role_id,
								app_id: that.app_id,
								screen: v.screen,
								screen_sequence: "",
								screen_for_nav: false,
								applicable: false,
								field: "-",
								create: false,
								edit: false,
								delete: false,
								deleted: v.deleted
							  };
						  jQuery.each(screen_rights.results,function(indx,val){							  
							  if(val.screen === v.screen){
								entry = jQuery.extend(true, {}, val);
								/*entry._id = val._id;
								entry.role_id = val.role_id;
								entry.app_id = val.app_id;
								entry.screen_sequence = val.screen_sequence;
								entry.screen_for_nav = val.screen_for_nav;
								entry.applicable = val.applicable;
								entry.field = val.field;
								entry.create = val.create;
								entry.edit = val.edit;
								entry.delete = val.delete;*/
							  }							  
						  });
						  that.screen_right.push(entry);
					  });
					  this.screen_right.sort((a: any, b: any)=> {return a.screen_sequence - b.screen_sequence;});//ascending sort
				});
		});
	  /*this.commonService.adminService.getScrRights(this.role_id,this.app_id)
					.subscribe( screens => {
						this.screen_right = screens.results;
						this.screen_right.sort((a: any, b: any)=> {return a.screen_sequence - b.screen_sequence;});//ascending sort
					});*/
  }
  
  onRoleChange(selected){
	  this.role_id = selected;
	  this.loadScreenMappings();
	  /*this.commonService.adminService.getScrRights(selected,this.app_id)
		  .subscribe( screens => {
			  this.screen_right = screens.results;
			  this.screen_right.sort((a: any, b: any)=>{return a.screen_sequence - b.screen_sequence;});//ascending sort
		  });*/
  }
  onAppChange(selected){
	  this.app_id = selected;
	  this.loadScreenMappings();
	  /*this.commonService.adminService.getScrRights(this.role_id,selected)
		  .subscribe( screens => {
			  this.screen_right = screens.results;
			  this.screen_right.sort((a: any, b: any)=>{return a.screen_sequence - b.screen_sequence;});//ascending sort
		  });*/
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
  
  onAddScreen(evt){
	this.hidden.view = true;
	this.hidden.add = false;
	this.commonService.adminService.getScreen()
		  .subscribe( screens => this.screens = screens.results);
	this.newItem = {
						subscription_id: "-",
						app_id: "",
						role_id: "",
						screen: "",
						screen_sequence: "",
						screen_for_nav: true,
						applicable: false,
						field: "-",
						create: false,
						edit: false,
						delete: false,
						visible: false,
						editable: false,
						createdBy: "",
						createdAt: "",
						changedBy: "",
						changedAt: "",
						deleted: false
						};
  }
  onSaveChanges(evt){
	  var that = this;
	  var doc = [];
	  var max_sequence:any = this.screen_right[this.screen_right.length - 1].screen_sequence;
	  jQuery.each(that.screen_right,function(i,v){
		  if(v._id || v.applicable){
			 if(!(v.screen_sequence)){
				v.screen_sequence = (max_sequence - (-1)).toString();
				max_sequence = max_sequence - (-1);
			 }
			 doc.push(v); 
		  }
	  });
	  this.commonService.adminService.updateMultiRights({rights:doc})
		   .subscribe( data => {	
		    
			if(data.error){
				alert("Unable to save");
			}
			else{
				this.onEditCancel("");
			}		  
		  });
  }
  onAddSave(evt){
	this.commonService.adminService.getScrRights(this.newItem.role_id,this.newItem.app_id)
		.subscribe( screens => {
			var screen_right = screens.results;
			this.newItem.screen_sequence = '0';
			if(screen_right.length > 0){
				screen_right.sort((a: any, b: any)=> {return b.screen_sequence - a.screen_sequence;});//descending sort
				this.newItem.screen_sequence = (screen_right[0].screen_sequence - (-1)).toString();
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
	  this.loadScreenMappings();
	  /*this.commonService.adminService.getScrRights(this.role_id,this.app_id)
		  .subscribe( screens => {
			  this.screen_right = screens.results;
			  this.screen_right.sort((a: any, b: any)=>{return a.screen_sequence - b.screen_sequence;});//ascending sort
		  });*/
  }
  onSelectAll(evt){
	  this.editMode = true;
	  for(var i = 0; i<this.screen_right.length; i++){
		 this.screen_right[i].applicable = true;
		 this.screen_right[i].create = true;
		 this.screen_right[i].edit = true;
		 this.screen_right[i].delete = true;
		 this.screen_right[i].editMode = true;
	  }
  }
  
  moveUp(evt,screen,indx){ 
	 if(this.screen_right[indx - 1]){
		 var above = this.screen_right[indx - 1].screen_sequence;
		 var below = this.screen_right[indx].screen_sequence;
		 if(above && below){
			 this.screen_right[indx - 1].screen_sequence = below;
			 this.screen_right[indx].screen_sequence = above;
			 this.screen_right.sort((a: any, b: any)=> {return a.screen_sequence - b.screen_sequence;});//ascending sort
		 }
	 }
  }
  
  moveDown(evt,screen,indx){	 
	 if(this.screen_right[indx - (-1)]){
		 var above = this.screen_right[indx].screen_sequence;
		 var below = this.screen_right[indx - (-1)].screen_sequence;
		 if(above && below){
			 this.screen_right[indx].screen_sequence = below;
			 this.screen_right[indx - (-1)].screen_sequence = above;
			 this.screen_right.sort((a: any, b: any)=> {return a.screen_sequence - b.screen_sequence;});//ascending sort
		 }
	 }
  }
  
  onEditScreen(evt,screen){
	  screen.editMode = true;
	  this.editMode = true;
  }
  onEditCancel(evt){
	  this.loadScreenMappings();
	  this.editMode = false;
	  jQuery.each(this.screen_right,function(i,v){
		  v.editMode = false;
	  });
  }
  
  
}
