//
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { CommonService } from '../common.service';
import { SharedService } from '../shared.service';
import { Subscription } from 'rxjs/Subscription';
import { AuthenticationService } from '../authentication.service';
declare var jQuery:any;

interface userDetail{
		_id?: string,
		admin: boolean,
		changedAt: string,
		changedBy: string, 
		createdAt: string, 
		createdBy: string, 
		currency: string, 
		deleted: boolean, 
		email: string, 
		email_verified: string, 
		gender: string, 
		login_password: string, 
		mobile: string, 
		mobile_verified: string,
		name: string,
		user_id: string,
		walletAmount: string
}

@Component({
    selector: 'app-root',
    templateUrl: './containerAdmin.component.html',
   styleUrls: ['./containerAdmin.component.css'],
   providers: [CommonService]
})
export class AppContainerAdmin implements OnInit{
	router: Router;
	userProfile: any = {};
	title: string = "";
	name = "Parent Component";
	message: any;
    subscription: Subscription;
	 
	
constructor(private auth: AuthenticationService, private commonService: CommonService, private sharedService: SharedService, router: Router) { 
	
	this.router = router;
	this.router.events.subscribe((event:any) => {
		if(event.constructor.name === 'NavigationEnd') {
			if(event.url === '/ContainerAdmin/RoleAdmin')
				document.getElementById('role_admin').className += ' active-nav-item';
			if(event.url === '/ContainerAdmin/ApplicationAdmin')
				document.getElementById('app_admin').className += ' active-nav-item';
			if(event.url === '/ContainerAdmin/ScreenAdmin')
				document.getElementById('screen_admin').className += ' active-nav-item';
			if(event.url === '/ContainerAdmin/FieldAdmin')
				document.getElementById('field_admin').className += ' active-nav-item';
			if(event.url === '/ContainerAdmin/SubscriptionAdmin')
				document.getElementById('subscription_admin').className += ' active-nav-item';
			if(event.url === '/ContainerAdmin/ProductTypeAdmin')
				document.getElementById('prodTyp_admin').className += ' active-nav-item';
			if(event.url === '/ContainerAdmin/ProductAdmin')
				document.getElementById('prod_admin').className += ' active-nav-item';
			if(event.url === '/ContainerAdmin/ProductHierarchyAdmin')
				document.getElementById('productHierarchy_admin').className += ' active-nav-item';
			if(event.url === '/ContainerAdmin/BrandAdmin')
				document.getElementById('brand_admin').className += ' active-nav-item';
			if(event.url === '/ContainerAdmin/SpecificationFieldAdmin')
				document.getElementById('specField_admin').className += ' active-nav-item';
			if(event.url === '/ContainerAdmin/LocAdmin')
				document.getElementById('loc_admin').className += ' active-nav-item';
			if(event.url === '/ContainerAdmin/ConfigAdmin')
				document.getElementById('config_admin').className += ' active-nav-item';
		}
		// NavigationEnd
		// NavigationCancel
		// NavigationError
		// RoutesRecognized
	  });
  }
	
ngOnInit() {
	var that = this;
	this.sharedService.sharedObj.containerContext = this;	
	this.sharedService.getUserProfile(function(user){
		that.userProfile = user;
	  	//this.userProfile = this.sharedService.sharedObj.userProfile;
	});
}
openNav() {
	document.getElementById("mySidenavAdmin").style.display = "block";
    document.getElementById("myOverlayAdmin").style.display = "block";
}

closeNav() {
	document.getElementById("mySidenavAdmin").style.display = "none";
    document.getElementById("myOverlayAdmin").style.display = "none";
}

onUserClick(evt){
	debugger;
}

onNav(evt){
	jQuery("button").removeClass("active-nav-item");
	evt.srcElement.className += ' active-nav-item';
	var link = evt.srcElement.id;
	var that = this;
	switch(link){
		case "role_admin":
			that.router.navigateByUrl('/ContainerAdmin/RoleAdmin');
			break;
		
		case "app_admin":
			that.router.navigateByUrl('/ContainerAdmin/ApplicationAdmin');
			break;
		
		case "screen_admin":
			that.router.navigateByUrl('/ContainerAdmin/ScreenAdmin');
			break;
		
		case "field_admin":
			that.router.navigateByUrl('/ContainerAdmin/FieldAdmin');
			break;
		
		case "subscription_admin":
			that.router.navigateByUrl('/ContainerAdmin/SubscriptionAdmin');
			break;
		
		case "screenRight_admin":
			that.router.navigateByUrl('/ContainerAdmin/ScreenMappingAdmin');
			break;
		
		case "fieldRight_admin":
			that.router.navigateByUrl('/ContainerAdmin/FieldMappingAdmin');
			break;
		
		case "prodTyp_admin":
			that.router.navigateByUrl('/ContainerAdmin/ProductTypeAdmin');
			break;
			
		case "prod_admin":
			that.router.navigateByUrl('/ContainerAdmin/ProductAdmin');
			break;
			
		case "productHierarchy_admin":
			that.router.navigateByUrl('/ContainerAdmin/ProductHierarchyAdmin');
			break;
			
		case "brand_admin":
			that.router.navigateByUrl('/ContainerAdmin/BrandAdmin');
			break;
			
		case "specField_admin":
			that.router.navigateByUrl('/ContainerAdmin/SpecificationFieldAdmin');
			break;
			
		case "prdTypSpecField_admin":
			that.router.navigateByUrl('/ContainerAdmin/PrdTypSpecFieldMapAdmin');
			break;
			
		case "loc_admin":
			that.router.navigateByUrl('/ContainerAdmin/LocAdmin');
			break;
			
		case "config_admin":
			that.router.navigateByUrl('/ContainerAdmin/ConfigAdmin');
			break;
	}
	//this.closeNav();
}

logout(){
	this.auth.logout();
}
	

}
