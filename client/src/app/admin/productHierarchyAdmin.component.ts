//
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { CommonService } from '../common.service';
import { SharedService } from '../shared.service';
declare var jQuery:any;

interface newItem {
		  parent_product_hierarchy_id: string,
		  product_hierarchy_id: string,
		  product_type_id: string,
		  product_type_name: string,
		  child_product_hierarchy_id: string,
		  deleted: boolean,
		  createdBy: string,
		  createdAt: string,
		  changedBy: string,
		  changedAt: string
}

@Component({
    //selector: 'app-root',
    templateUrl: './productHierarchyAdmin.component.html',
   styleUrls: ['./productHierarchyAdmin.component.css'],
   providers: [CommonService]
})
export class AppProductHierarchyAdmin implements OnInit {
	router: Router;
	newItem: newItem;
	prd_h: any;
	prd: any;
	showDialog: boolean = false;
	productTypes: Array<{
		_id?: string,
		product_type_id: string,
		product_type_name: string
	}>;
	
	constructor(private commonService: CommonService, private sharedService: SharedService, router: Router) { 
		this.router = router;
	  }
  
	ngOnInit(){
		var that = this;
		this.sharedService.sharedObj.containerContext.title = "Product Hierarchy";
		this.loadPrdHierarchy();                            
	}
	
	loadPrdHierarchy(){
		this.commonService.adminService.getProductHierarchy("")
		  .subscribe( productHierarchys => {
			  this.prd = productHierarchys.results;
			  this.prd_h = this.prd.filter(function(item){ return (item.parent_product_hierarchy_id == "" ) ;}) ;
              this.createNode(this.prd_h);
		  }); 
	}
 
	createNode(prd_h){
                var that = this;
                jQuery.each(prd_h,function(i,v){
                                v.nodes = that.prd.filter(function(item){
                                                return (item.parent_product_hierarchy_id == v.product_hierarchy_id) ;
                                }) ;
                                if(v.nodes && v.nodes.length > 0){
                                                that.createNode(v.nodes);
                                }
                });
	}
	
	addFirstLevelNode(evt){
		var node = {product_hierarchy_id:""};
		this.addNode(node);
	}

  addNode(data){
	 this.commonService.adminService.getProductType("")
		  .subscribe( productTypes => this.productTypes = productTypes.results);
	 this.showDialog = true;
	 this.newItem = {
		  parent_product_hierarchy_id: data.product_hierarchy_id,
		  product_hierarchy_id: '',
		  product_type_id: '',
		  product_type_name: '',
		  child_product_hierarchy_id: '',
		  deleted: false,
		  createdBy: "",
		  createdAt: "",
		  changedBy: "",
		  changedAt: ""
	  }
  }
  deleteNode(data){
	  //var node = jQuery.extend(true, {}, data);
	  //node.deleted = true;
	  //delete node.nodes;
	  var updatedRecords = [];
	  var nodes = [];
	  nodes.push(data);
	  //updatedRecords.push(node);
	  this.convertToPlainStructure(nodes,updatedRecords);
	  this.commonService.adminService.updateMultiProductHierarchy({prdHierarchy: updatedRecords})
		   .subscribe( data => {	
			    
			   this.loadPrdHierarchy(); 					  
		  });
  }
  
  convertToPlainStructure(nodes,updatedRecords){
	  var that = this;
	  jQuery.each(nodes,function(i,v){
		  var node = jQuery.extend(true, {}, v);
		  node.deleted = true;
		  delete node.nodes;
		  updatedRecords.push(node);
		  if(v.nodes && v.nodes.length > 0)
			that.convertToPlainStructure(v.nodes,updatedRecords);
	  });
  }
  
  onPrdTypSelect(evt,prdTyp){
		this.newItem.product_type_id = prdTyp.product_type_id;
		this.newItem.product_type_name = prdTyp.product_type_name;
		this.commonService.adminService.addProductHierarchy(this.newItem)
		   .subscribe( data => {	
		    
			if(data.statusCode=="S"){
				this.showDialog = false;
				this.loadPrdHierarchy(); 
			}
			else{
				alert("Unable to save");
			}		  
		  });
  }
}
