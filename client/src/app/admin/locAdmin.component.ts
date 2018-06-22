//
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { CommonService } from '../common.service';
import { SharedService } from '../shared.service';

interface hidden {
  view: boolean,
  add: boolean
}


@Component({
    //selector: 'app-root',
    templateUrl: './locAdmin.component.html',
   styleUrls: ['./locAdmin.component.css'],
   providers: [CommonService]
})
export class AppLocAdmin implements OnInit {
	router: Router;
	hidden: hidden;
	disabled: any = {};
	newItem: any = {};
	locs: any = [];
	editMode: boolean = false;
	
	constructor(private commonService: CommonService, private sharedService: SharedService, router: Router) { 
	this.router = router;
  }
  
	ngOnInit() {
		this.sharedService.sharedObj.containerContext.title = "Locations";
		this.hidden = {view: false, add: true};
		this.disabled = {field: false};
		
	  	this.commonService.adminService.getLoc("","","","")
		  .subscribe( res => this.locs = res.results);
  }
  onAddClick(evt){
	  this.hidden.view = true;
	  this.hidden.add = false;
	  this.disabled.field = false;
	  this.editMode = false;
	  this.newItem = {
						country:"", 
						state:"",
						city:"",
						location:""
					};
  }
  onAddCancel(evt){
	  this.hidden.view = false;
	  this.hidden.add = true;
	  this.commonService.adminService.getLoc("","","","")
		  .subscribe( res => this.locs = res.results);
  }
  
  onSave(evt){
		if(this.editMode)
			this.onEditSave(evt)
		else
			this.onAddSave(evt);
	  }
  onAddSave(evt){
	  this.commonService.adminService.addLoc(this.newItem)
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
	  this.commonService.adminService.updateLoc(this.newItem)
		   .subscribe( data => {	
		    
			if(data.statusCode=="S"){
				this.onAddCancel("");
			}
			else{
				alert("Unable to update");
			}		  
		  });
  }
  
  onLocClick(evt,obj){
	  this.hidden.view = true;
	  this.hidden.add = false;	  
	  this.disabled.field = true;
	  this.newItem = obj;
  }
  onEdit(evt,doc){
	  this.hidden.view = true;
	  this.hidden.add = false;	  
	  this.disabled.field = false;
	  this.editMode = true;
	  this.newItem = doc;
  }
  onDelete(evt,doc){
	  var that = this;
	   
	  doc.deleted = true;
	  this.commonService.adminService.updateLoc(doc)
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
