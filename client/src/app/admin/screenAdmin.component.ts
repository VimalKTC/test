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
  screen: boolean
}
interface newItem {
	screen: string
}


@Component({
    //selector: 'app-root',
    templateUrl: './screenAdmin.component.html',
   styleUrls: ['./screenAdmin.component.css'],
   providers: [CommonService]
})
export class AppScreenAdmin implements OnInit {
	router: Router;
	hidden: hidden;
	disabled: disabled;
	newItem: newItem;
	screens: Array<{
		_id?: string,
		screen: string
	}>;
	
	constructor(private commonService: CommonService, private sharedService: SharedService, router: Router) { 
		this.router = router;
	  };
  
	ngOnInit() {
		this.sharedService.sharedObj.containerContext.title = "Screen";
		this.hidden = {view: false, add: true};
		this.disabled = {screen: true};
		this.newItem = {
						screen:""
						};
	  	  this.commonService.adminService.getScreen()
		  .subscribe( screens => this.screens = screens.results);
  }
  onAddClick(evt){
	  this.hidden.view = true;
	  this.hidden.add = false;
	  this.disabled.screen = false;
	  this.newItem = {
						screen:""
						};
  }
  onAddCancel(evt){
	  this.hidden.view = false;
	  this.hidden.add = true;
	  this.commonService.adminService.getScreen()
		  .subscribe( screens => this.screens = screens.results);
  }
  onAddSave(evt){
	  this.commonService.adminService.addScreen(this.newItem)
		   .subscribe( data => {	
		    
			if(data.statusCode=="S"){
				this.onAddCancel("");
			}
			else{
				alert("Unable to save");
			}		  
		  });
  }
  onScreenClick(evt,obj){
	  this.hidden.view = true;
	  this.hidden.add = false;	  
	  this.disabled.screen = true;
	  this.newItem = obj;
  }
  onDelete(evt,doc){
	  var that = this;
	   
	  
  }
}
