import { Injectable } from '@angular/core';
import { User } from './user';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { AuthenticationService } from './authentication.service';
import { SharedService } from './shared.service';

@Injectable()
export class AdminService {
  token: string = "";
  constructor(private auth: AuthenticationService, private sharedService: SharedService) { 
	this.token = this.auth.getToken();
  }
 
  
  ////////////////////////////////////////APPLICATION//////////////////////////////////////////////////////
  getApplication(app_id){
	  return this.sharedService.call('application/?app_id='+app_id, "get", null, true);	  
  }
  
  addApplication(newApp){
	  return this.sharedService.call('application', "post", newApp, true);
  }
  
  updateApplication(updateApp){
	  
	  return this.sharedService.call('application', "put", updateApp, true);
  }
  
  ////////////////////////////////////////ROLE//////////////////////////////////////////////////////
  getRole(role_id){
	  return this.sharedService.call('role/?role_id='+role_id, "get", null, true);
  }
  
  addRole(newRole){	  
	  return this.sharedService.call('role', "post", newRole, true);
  }
  
  updateRole(updateRole){
	  
	  return this.sharedService.call('role', "put", updateRole, true);
  }
  
  ////////////////////////////////////////SUBSCRIPTION///////////////////////////////////////////////////////
  getSubscription(subscription_id,app_name){
	  return this.sharedService.call('subscription/?subscription_id='+subscription_id+'&app_name='+app_name, "get", null, true);
  }
  
  addSubscription(newSubscription){	  
	  return this.sharedService.call('subscription', "post", newSubscription, true);
  }
  
  updateSubscription(updateSubscription){
	  return this.sharedService.call('subscription', "put", updateSubscription, true);
  }
  
  /////////////////////////////////////////SCREEN//////////////////////////////////////////////////////////
  getScreen(){
	  return this.sharedService.call('screens', "get", null, true);
  }
  
  addScreen(newScreen){
	  return this.sharedService.call('screens', "post", newScreen, true);
  }
  
  updateScreen(updateScreen){
	  return this.sharedService.call('screens', "put", updateScreen, true);
  }
  
  //////////////////////////////////////////FIELD////////////////////////////////////////////////////////////
  getField(){
	  return this.sharedService.call('fields', "get", null, true);
  }
  
  addField(newField){
	  return this.sharedService.call('fields', "post", newField, true);
  }
  
  updateField(updateField){
	  return this.sharedService.call('fields', "put", updateField, true);
  }
  
  //////////////////////////////////////////APP SCREEN FIELD RIGHTS/////////////////////////////////////////////////////////////////
  getRights(app_id,screen,field){
	  return this.sharedService.call('appScrFieldsRights/?app_id='+app_id+'&screen='+screen+'&field='+field, "get", null, true);
  }
  
  addRights(newRights){
	  return this.sharedService.call('appScrFieldsRights', "post", newRights, true);
  }
  
  updateRights(updateRights){
	  return this.sharedService.call('appScrFieldsRights', "put", updateRights, true);
  }
  
  getScrRights(role_id,app_id){
	  return this.sharedService.call('appScrRights/?app_id='+app_id+'&role_id='+role_id, "get", null, true);
  }
  getFieldRights(role_id,app_id,screen){
	  return this.sharedService.call('appFieldRights/?app_id='+app_id+'&screen='+screen+'&role_id='+role_id, "get", null, true);
  }
  
  updateMultiRights(records){
	  return this.sharedService.call('multipleRights', "put", records, true);
  }
  
  
   //////////////////////////////////////////PRODUCT TYPE////////////////////////////////////////////////////////////
  getProductType(product_type_id){
	  return this.sharedService.call('productTyp/?product_type_id='+product_type_id, "get", null, true);
  }
  
  addProductType(newProductType){
	  return this.sharedService.call('productTyp', "post", newProductType, true);
  }
  
  updateProductType(updateProductType){
	  return this.sharedService.call('productTyp', "put", updateProductType, true);
  }
  
  
   //////////////////////////////////////////PRODUCT HIERARCHY////////////////////////////////////////////////////////////
  getProductHierarchy(product_type_id){
	  return this.sharedService.call('productHierarchy/?product_type_id='+product_type_id, "get", null, true);
  }
  
  addProductHierarchy(newProductHierarchy){
	  return this.sharedService.call('productHierarchy', "post", newProductHierarchy, true);
  }
  
  updateProductHierarchy(updateProductHierarchy){
	  return this.sharedService.call('productHierarchy', "put", updateProductHierarchy, true);
  }
  
  updateMultiProductHierarchy(records){
	  return this.sharedService.call('updateMultiProductHierarchy', "put", records, true);
  }
  
  
  //////////////////////////////////////////SPECIFICATION FIELD////////////////////////////////////////////////////////////
  getSpecification(specification_field_id){
	  return this.sharedService.call('specField/?specification_field_id='+specification_field_id, "get", null, true);
  }
  
  addSpecification(newSpecification){
	  return this.sharedService.call('specField', "post", newSpecification, true);
  }
  
  updateSpecification(updateSpecification){
	  return this.sharedService.call('specField', "put", updateSpecification, true);
  }
  
  
  //////////////////////////////////////////PRODUCT TYPE & SPECIFICATION FIELD MAPPING////////////////////////////////////////////////////////////
  getPrdTypSpecFieldMap(product_type_id){
	  return this.sharedService.call('prdTypSpecFieldMap/?product_type_id='+product_type_id, "get", null, true);
  }
  
  addPrdTypSpecFieldMap(newPrdTypSpecFieldMap){
	  return this.sharedService.call('prdTypSpecFieldMap', "post", newPrdTypSpecFieldMap, true);
  }
  
  updatePrdTypSpecFieldMap(updatePrdTypSpecFieldMap){
	  return this.sharedService.call('prdTypSpecFieldMap', "put", updatePrdTypSpecFieldMap, true);
  }  
  
  
   //////////////////////////////////////////PRODUCTS////////////////////////////////////////////////////////////
  getProduct(product_id,product_type_id,brand_name){
	  return this.sharedService.call('product/?product_id='+product_id+'&product_type_id='+product_type_id+'&brand_name='+brand_name, "get", null, true);
  }
  
  addProduct(newProduct){
	  return this.sharedService.call('product', "post", newProduct, true);
  }
  
  updateProduct(updateProduct){
	  return this.sharedService.call('product', "put", updateProduct, true);
  }
  
  getModel(product_type_id,brand_name){
	  return this.sharedService.call('product/?product_type_id='+product_type_id+'&brand_name='+brand_name, "get", null, true);
  }
  getVariant(product_type_id,brand_name,model){
	  return this.sharedService.call('product/?product_type_id='+product_type_id+'&brand_name='+brand_name+'&model='+model, "get", null, true);
  }
  
  getServiceProduct(brand_id){
	  return this.sharedService.call('serviceproduct/?brand_id='+brand_id, "get", null, true);
  }
  getUniqueBrandBasedOnPrdTyp(product_type_id){
	  return this.sharedService.call('uniqueBrandBasedOnPrdTyp/?product_type_id='+product_type_id, "get", null, true);
  }
  
   //////////////////////////////////////////BRANDS////////////////////////////////////////////////////////////
  getBrand(brand_id){
	  return this.sharedService.call('brand/?brand_id='+brand_id, "get", null, true);
  }
  
  addBrand(newBrand){
	  return this.sharedService.call('brand', "post", newBrand, true);
  }
  
  updateBrand(updateBrand){
	  return this.sharedService.call('brand', "put", updateBrand, true);
  }
  
  
  //////////////////////////////////////////PRODUCT SPECIFICATION ////////////////////////////////////////////////////////////
  getProductSpec(product_id){
	  return this.sharedService.call('productSpec/?product_id='+product_id, "get", null, true);
  }
  
  addProductSpec(newProductSpec){
	  return this.sharedService.call('productSpec', "post", newProductSpec, true);
  }
  
  updateProductSpec(updateProductSpec){
	  return this.sharedService.call('productSpec', "put", updateProductSpec, true);
  } 
  addMultiProductSpec(docs){
	  return this.sharedService.call('multiProductSpec', "post", {docs: docs}, true);
  }
  
  
  
  
   //////////////////////////////////////////PRODUCT IMAGE////////////////////////////////////////////////////////////
  getPrdImage(image_id,product_id){
	  return this.sharedService.call('prdImage/?image_id='+image_id+'&product_id='+product_id, "get", null, true);
  }
  
  addPrdImage(newPrdImage){
	  return this.sharedService.call('prdImage', "post", newPrdImage, true);
  }
  
  updatePrdImage(updatePrdImage){
	  return this.sharedService.call('prdImage', "put", updatePrdImage, true);
  }
  
  
  
   //////////////////////////////////////////PRODUCT THUMBNAIL////////////////////////////////////////////////////////////
  getPrdThumbnail(product_id,color){
	  return this.sharedService.call('prdThumbnail/?product_id='+product_id+'&color='+color, "get", null, true);
  }
  
  addPrdThumbnail(newPrdThumbnail){
	  return this.sharedService.call('prdThumbnail', "post", newPrdThumbnail, true);
  }
  
  updatePrdThumbnail(updatePrdThumbnail){
	  return this.sharedService.call('prdThumbnail', "put", updatePrdThumbnail, true);
  }
  
  deletePrdThumbnail(doc){
	  return this.sharedService.call('prdThumbnailDelete', "put", doc, true);
  }
  
  getPrdThumbnailColors(product_id){
	  return this.sharedService.call('prdThumbnailColors/?product_id='+product_id, "get", null, true);
  }
  
  
  ////////////////////////////////////////LOCATION//////////////////////////////////////////////////////
  getLoc(country,state,city,location){
	  return this.sharedService.call('loc/?country='+country+'&state='+state+'&city='+city+'&location='+location, "get", null, true);	  
  }
  
  addLoc(newLoc){
	  return this.sharedService.call('loc', "post", newLoc, true);
  }
  
  updateLoc(updateLoc){
	  
	  return this.sharedService.call('loc', "put", updateLoc, true);
  }
  
  
  ////////////////////////////////////////CONFIG PARAMETER//////////////////////////////////////////////////////
  getAllParameter(){
	  return this.sharedService.call('allConfig', "get", null, true);	  
  }
  
  getParameter(parameter){
	  return this.sharedService.call('config/?parameter='+parameter, "get", null, true);	  
  }
  
  addParameter(newParameter){
	  return this.sharedService.call('config', "post", newParameter, true);
  }
  
  updateParameter(updateParameter){	  
	  return this.sharedService.call('config', "put", updateParameter, true);
  }
  
  deleteParameter(item){
	  return this.sharedService.call('config/'+item._id, "delete", null, true);
  }
  
  
  
  
  
  
  
}
