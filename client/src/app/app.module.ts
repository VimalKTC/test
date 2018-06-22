import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatRadioModule, MatButtonModule, MatTabsModule, MatTabChangeEvent, MatSidenavModule, MatToolbarModule, MatListModule  } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FilterPipe, SortByPipe } from './pipes';
import { AuthenticationService } from './authentication.service';
import { AuthGuardService } from './auth-guard.service';
import { CommonService } from './common.service';
import { SharedService } from './shared.service';
import { AdminService } from './admin.service';
import { EndUserService } from './enduser.service';
import { DialogComponent } from './dialog.component';

import { AppComponent } from './app.component';

import { AppLogin } from './user/login.component';
import { AppSignup } from './user/signup.component';

import { AppContainerAdmin } from './admin/containerAdmin.component';
import { AppApplicationAdmin } from './admin/applicationAdmin.component';
import { AppRoleAdmin } from './admin/roleAdmin.component';
import { AppScreenAdmin } from './admin/screenAdmin.component';
import { AppFieldAdmin } from './admin/fieldAdmin.component';
import { AppSubscriptionAdmin } from './admin/subscriptionAdmin.component';
import { AppScreenMappingAdmin } from './admin/screenMappingAdmin.component';
import { AppFieldMappingAdmin } from './admin/fieldMappingAdmin.component';
import { AppProductTypeAdmin } from './admin/productTypeAdmin.component';
import { AppProductHierarchyAdmin } from './admin/productHierarchyAdmin.component';
import { AppProductAdmin } from './admin/productAdmin.component';
import { AppBrandAdmin } from './admin/brandAdmin.component';
import { AppSpecificationFieldAdmin } from './admin/specificationFieldAdmin.component';
import { AppPrdTypSpecFieldMapAdmin } from './admin/prdTypSpecFieldAdmin.component';
import { AppLocAdmin } from './admin/locAdmin.component';
import { AppConfigAdmin } from './admin/configAdmin.component';

import { AppContainer } from './enduser/container.component';
import { AppHome } from './enduser/home.component';
import { AppFilter } from './enduser/filter.component';
import { AppFav } from './enduser/favourite.component';
import { AppAccountDetail } from './enduser/accountdetail.component';
import { AppSubscription } from './enduser/subscription.component';
import { AppBuySubscription } from './enduser/buySubscription.component';
import { AppAddress } from './enduser/address.component';
import { AppAlert } from './enduser/alert.component';
import { AppSell } from './enduser/sell.component';
import { AppDynamicForm } from './enduser/reusable/dynamicForm.component';
import { AppImageTemplate } from './enduser/reusable/imageTemplate.component';
import { AppBid } from './enduser/bid.component';
import { AppBuy } from './enduser/buy.component';
import { AppBidBy } from './enduser/bidBy.component';
import { AppService } from './enduser/service.component';
import { AppServiceForm } from './enduser/reusable/serviceForm.component';
import { AppTileTemplate } from './enduser/reusable/tileTemplate.component';

const appRoutes: Routes = [
	{ path: '', component: AppLogin },
	{ path: 'Signup', component: AppSignup },
	{ path: 'ContainerAdmin', component: AppContainerAdmin, 
	children:[
		{path: '', redirectTo: 'ApplicationAdmin', pathMatch: 'full'},
		{path: 'ApplicationAdmin', component: AppApplicationAdmin, canActivate: [AuthGuardService]},
		{path: 'RoleAdmin', component: AppRoleAdmin, canActivate: [AuthGuardService]},
		{path: 'ScreenAdmin', component: AppScreenAdmin, canActivate: [AuthGuardService]},
		{path: 'FieldAdmin', component: AppFieldAdmin, canActivate: [AuthGuardService]},
		{path: 'SubscriptionAdmin', component: AppSubscriptionAdmin, canActivate: [AuthGuardService]},
		{path: 'ScreenMappingAdmin', component: AppScreenMappingAdmin, canActivate: [AuthGuardService]},
		{path: 'FieldMappingAdmin', component: AppFieldMappingAdmin, canActivate: [AuthGuardService]},
		{path: 'ProductTypeAdmin', component: AppProductTypeAdmin, canActivate: [AuthGuardService]},
		{path: 'ProductHierarchyAdmin', component: AppProductHierarchyAdmin, canActivate: [AuthGuardService]},
		{path: 'ProductAdmin', component: AppProductAdmin, canActivate: [AuthGuardService]},
		{path: 'BrandAdmin', component: AppBrandAdmin, canActivate: [AuthGuardService]},
		{path: 'SpecificationFieldAdmin', component: AppSpecificationFieldAdmin, canActivate: [AuthGuardService]},
		{path: 'PrdTypSpecFieldMapAdmin', component: AppPrdTypSpecFieldMapAdmin, canActivate: [AuthGuardService]},
		{path: 'LocAdmin', component: AppLocAdmin, canActivate: [AuthGuardService]},
		{path: 'ConfigAdmin', component: AppConfigAdmin, canActivate: [AuthGuardService]}
	]},
	{ path: 'Container', component: AppContainer ,
	children:[
		{ path: '', redirectTo: 'Home', pathMatch: 'full'},
		{ path: 'Home', component: AppHome, canActivate: [AuthGuardService]},
		{ path: 'Filter', component: AppFilter, canActivate: [AuthGuardService]},
		{ path: 'Favourite', component: AppFav, canActivate: [AuthGuardService]},
		{ path: 'Account', component: AppAccountDetail, canActivate: [AuthGuardService]},
		{ path: 'Address', component: AppAddress, canActivate: [AuthGuardService]},
		{ path: 'Subscription', component: AppSubscription, canActivate: [AuthGuardService]},
		{ path: 'Alert', component: AppAlert, canActivate: [AuthGuardService]},
		{ path: 'Sell', component: AppSell, canActivate: [AuthGuardService]},
		{ path: 'Sell/:id', component: AppSell, canActivate: [AuthGuardService]},
		{ path: 'Bid', component: AppBid, canActivate: [AuthGuardService]},
		{ path: 'Bid/:id', component: AppBid, canActivate: [AuthGuardService]},
		{ path: 'Buy', component: AppBuy, canActivate: [AuthGuardService]},
		{ path: 'Buy/:id', component: AppBuy, canActivate: [AuthGuardService]},
		{ path: 'Service', component: AppService, canActivate: [AuthGuardService]},
		{ path: 'Service/:id', component: AppService, canActivate: [AuthGuardService]}
	]}
];


@NgModule({
  declarations: [
	  //End User
	  AppService,
	  AppBidBy,
	  AppBuy,
	  AppBid,
	  AppImageTemplate,
	  AppDynamicForm,
	  AppServiceForm,
	  AppTileTemplate,
	  AppSell,
	  AppAlert,
	  AppAddress,
	  AppBuySubscription,
	  AppSubscription,
	  AppAccountDetail,
	  AppFav,
	  AppFilter,
	  AppHome,
	  AppContainer,
	  //Admin
	  AppConfigAdmin,
	  AppLocAdmin,	  
	  AppPrdTypSpecFieldMapAdmin,
	  AppSpecificationFieldAdmin,
	  AppBrandAdmin,
	  AppProductAdmin,
	  AppProductHierarchyAdmin,
	  AppProductTypeAdmin,
	  AppFieldMappingAdmin,
	  AppScreenMappingAdmin,
	  AppSubscriptionAdmin,
	  AppFieldAdmin,
	  AppScreenAdmin,
	  AppRoleAdmin,
	  AppApplicationAdmin,
	  AppContainerAdmin,
	  //User Login
	  AppSignup,
	  AppLogin,
	  AppComponent,
	  //Commons
	  DialogComponent,
	  FilterPipe, SortByPipe	  
  ],
  imports: [
    BrowserModule,
	RouterModule.forRoot(appRoutes),
	HttpClientModule,
	HttpModule,
	FormsModule,
	MatFormFieldModule, MatInputModule, MatSelectModule, MatRadioModule, MatCheckboxModule, MatButtonModule, MatTabsModule, MatSidenavModule, MatToolbarModule, MatListModule, 
	BrowserAnimationsModule
  ],
  providers: [AuthenticationService, AuthGuardService, CommonService,SharedService,AdminService,EndUserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
