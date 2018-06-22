//
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { CommonService } from '../common.service';
import { SharedService } from '../shared.service';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
declare var jQuery:any;

interface hidden {
  view: boolean,
  add: boolean
}
interface disabled {
  field: boolean
}
interface newItem {
	field: string,
	type: string,
	path: string,
	source: string,
	key: string,
	value: string,
	required: boolean,
	category: string,
	from_config: boolean,
	for_filter: boolean,
	service: any
}


@Component({
    //selector: 'app-root',
    templateUrl: './fieldAdmin.component.html',
   styleUrls: ['./fieldAdmin.component.css'],
   providers: [CommonService]
})
export class AppFieldAdmin implements OnInit {
	router: Router;
	hidden: hidden;
	disabled: disabled;
	newItem: newItem;
	types: any = [];
	editMode: boolean = false;
	categories: any = [];
	paths: any = [];
	services: any = [];
	
	fields: Array<{
		_id?: string,
		field: string,
		type: string,
		path: string,
		source: string,
		required: boolean,
		category: string,
		from_config: boolean,
		for_filter: boolean
	}>;
	
	constructor(private commonService: CommonService, private sharedService: SharedService, router: Router, private http: Http) { 
		var that = this;;
        this.getJSON().subscribe(data => {
                                           that.types = data.fieldTypes;
										   that.categories = data.categories;
										   that.paths = data.tableAttributes;
										   that.services = data.serviceName;
                     }, error => {
                                  console.log(error);
                     });
	  }
      public getJSON(): Observable<any> {
                          return this.http.get("./assets/local.json")
                                   .map((res) => res.json())
                                   //.catch((error) => console.log(error));
      }
		
  
	ngOnInit() {
		this.sharedService.sharedObj.containerContext.title = "Fields";
		this.hidden = {view: false, add: true};
		this.disabled = {field: true};
		this.newItem = {
						field:"",
						type:"",
						path:"",
						source: "",
						key: "",
						value: "",
						required: false,
						category: "",
						from_config: false,
						for_filter: false,
						service: {}
						};
	  	  this.loadField();
  }
  
  loadField(){
	  this.commonService.adminService.getField()
		  .subscribe( fields => {
			  this.fields = fields.results;
			  jQuery.each(this.fields,function(i,v){
				  var source_split = v.source.split('+');
				  if(source_split.length > 1){
					  v.source = source_split[0];
					  v.key = source_split[1];
					  v.value = source_split[2];
				  }
			  });
		  });
  }
  
  onAddClick(evt){
	  this.hidden.view = true;
	  this.hidden.add = false;
	  this.disabled.field = false;
	  this.editMode = false;
	  this.newItem = {
						field:"",
						type:"",
						path:"",
						source: "",
						key: "",
						value: "",
						required: false,
						category: "",
						from_config: false,
						for_filter: false,
						service: {}
						};
  }
  onAddCancel(evt){
	  this.hidden.view = false;
	  this.hidden.add = true;
	  this.loadField();
  }
  
  onSave(evt){
	  if(this.editMode)
		  this.onEditSave(evt);
	  else
		  this.onAddSave(evt);
  }
  
  onAddSave(evt){
	if(this.newItem.key)
		this.newItem.source = this.newItem.source + "+" + this.newItem.key;
	if(this.newItem.value && this.newItem.key)
		this.newItem.source = this.newItem.source + "+" + this.newItem.value;
	else if(this.newItem.value && !(this.newItem.key))
		this.newItem.source = this.newItem.source + "++" + this.newItem.value;
	this.commonService.adminService.addField(this.newItem)
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
	if(this.newItem.key)
		this.newItem.source = this.newItem.source + "+" + this.newItem.key;
	if(this.newItem.value && this.newItem.key)
		this.newItem.source = this.newItem.source + "+" + this.newItem.value;
	else if(this.newItem.value && !(this.newItem.key))
		this.newItem.source = this.newItem.source + "++" + this.newItem.value;
	this.commonService.adminService.updateField(this.newItem)
		   .subscribe( data => {	
		    
			if(data.statusCode=="S"){
				this.onAddCancel("");
			}
			else{
				alert("Unable to update");
			}		  
		  });
  }
  onFieldClick(evt,obj){
	  this.hidden.view = true;
	  this.hidden.add = false;	  
	  this.disabled.field = true;
	  this.newItem = obj;
  }
  onDelete(evt,doc){
	  var that = this;
	   
	   
  }
  
  onEditClick(evt,doc){
	  this.hidden.view = true;
	  this.hidden.add = false;	  
	  this.disabled.field = false;
	  this.editMode = true;
	  this.newItem = doc;
  }
  
  
  onServiceSelect(evt){
	  this.newItem.source = evt.name;
	  this.newItem.key = evt.key;
	  this.newItem.value = evt.value;
  }
  
  onCategorySelect(evt){
	  if(this.newItem.category === 'Filter'){
		  this.newItem.type = 'Select';
		  this.newItem.for_filter = true;
	  }
	  else{
		  //this.newItem.type = '';
		  this.newItem.for_filter = false;
	  }
  }
  setSource(evt){
	  if(this.newItem.from_config){
		  this.newItem.source = this.newItem.path;
		  this.newItem.key = 'name';
		  this.newItem.value = 'name';
	  }
	  else{
		  this.newItem.service = null;
		  this.newItem.source = '';
		  this.newItem.key = '';
		  this.newItem.value = '';
	  }
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  /*
  onTypeSelect(evt){
	  if(evt === 'Input' || evt === 'Checkbox' || evt === 'Radio'){
		  this.bindingSource_field = false;
		  this.fromConfig_field = false;
		  this.bindingKey_field = false;
		  this.bindingValue_field = false;
		  this.newItem.source = '';
		  this.newItem.key = '';
		  this.newItem.value = '';
	  }
	  else{
		  this.bindingSource_field = true;
		  this.fromConfig_field = true;
		  this.bindingKey_field = true;
		  this.bindingValue_field = true;
	  }
  }
  onFilterScreenSelect(evt){
	 if(evt.target.checked){
		  this.type_field = false;
		  this.category_field = false;
		  this.newItem.type = 'Select';
		  this.newItem.category = 'Detail';
	  } 
	  else{
		  this.type_field = true;
		  this.category_field = true;
		  this.newItem.type = '';
		  this.newItem.category = '';
	  } 
  }
  onFromConfigSelect(evt){
	  if(evt.target.checked){
		  this.bindingKey_field = false;
		  this.bindingValue_field = false;
		  this.newItem.key = '';
		  this.newItem.value = '';
	  }
	  else{
		  this.bindingKey_field = true;
		  this.bindingValue_field = true;
	  }
  }*/
}
