//const express = require('express');
//const router = express.Router();
const async = require("async");
const request = require('request');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var UserSubMap = mongoose.model('UserSubMap');
var Counter = mongoose.model('Counter');

//////////////////////////Users Profile Master Table////////////////////////////////
var Profile = mongoose.model('Profile');

module.exports.profileRead = function(req,res){//Fetch
	// If no user ID exists in the JWT return a 401
	if (!req.payload.user_id) {
		res.status(401).json({
		  "message" : "Unauthorized Access."
		});
	} else {
		var query = {};
		if(req.query.user_id){
			query.user_id = {"$regex":req.query.user_id, "$options":"i"};
		}
		if(req.query.mobile){
			query.mobile = {"$regex":req.query.mobile, "$options":"i"};
		}
		if(req.query.deleted){
			query.deleted = {"$regex":req.query.deleted, "$options":"i"};
		}
		else{
			query.deleted = {"$ne": true};
		}
		Profile.find(query,function(profile_err, profiles){
			if(profiles.length > 0){
				var result = JSON.parse(JSON.stringify(profiles));
				console.log(result);
				result[0].screenAccess = [];
				UserSubMap.find({user_id: {"$regex":result[0].user_id, "$options":"i"}},function(sub_err, subs){
					if(sub_err){
						res.json({statusCode:"F", msg:"Failed to retrieve user subscription", results: result,error: sub_err});		
					}
					var role_query = [];
					for(var i =0; i < subs.length; i++){
						role_query.push({"role_id": {"$eq": subs[i].role_id}});												
					}
					
					var screen_query =  [
												{"field": {"$regex": "-", "$options":"i"}},												
													//"role_id": {"$regex":req.query.role_id, "$options":"i"},
												{"deleted": {"$ne": true}}
											];
					if(role_query.length>0){
						screen_query.push({"$or": role_query},);
					}											
					var AppScrFieldsRights = mongoose.model('AppScrFieldsRights');
					AppScrFieldsRights.find({ $and: screen_query},function(screen_err, screens){
						if(screen_err){
							res.json({statusCode:"F", msg:"Failed to retrieve rights", results: result,error: screen_err});		
						}
						
						for(var i =0; i < screens.length; i++){
							result[0].screenAccess.push({name: screens[i].screen, for_nav: screens[i].screen_for_nav, sequence: screens[i].screen_sequence, applicable: screens[i].applicable, create: screens[i].create, edit: screens[i].edit});
						}
						res.json({statusCode:"S", msg:"Successfully retrieved.", results: result,error: screen_err});						
					});	
				});
			}
			else{
					res.json({statusCode:"F", msg:"Failed to retrieve the profile", results: profiles,error: profile_err});
			}			
		});
	}
};
module.exports.profileAdd = function(req,res){//Add New
	if (!req.payload.user_id) {
		res.status(401).json({
		  "message" : "Unauthorized Access."
		});
	} else {		
			var d = new Date();
			var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
			let newUserProfile = new Profile({
				user_id: req.body.user_id,
				admin: req.body.admin,
				mobile: req.body.mobile,
				name: req.body.name,
				gender: req.body.gender,
				email: req.body.email,
				currency: req.body.currency,
				walletAmount: req.body.walletAmount,
				mobile_verified: req.body.mobile_verified,
				email_verified: req.body.email_verified,
				deleted: req.body.deleted,
				createdBy: req.body.createdBy,
				createdAt: at,
				changedBy: req.body.changedBy,
				changedAt: at
			});
			
			newUserProfile.save((err, user)=>{
				if(err){
					res.json({statusCode: 'F', msg: 'Failed to add', error: err});
				}
				else{
					res.json({statusCode: 'S', msg: 'Entry added', user: user});
				}
			});
	}
};

module.exports.profileUpdate = function(req,res){//Update

	if (!req.payload.user_id) {
		res.status(401).json({
		  "message" : "Unauthorized Access."
		});
	}
	else{
		var d = new Date();
		var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
		let updateUserProfile = {
			_id: req.body._id,
			user_id: req.body.user_id,
			admin: req.body.admin,
			mobile: req.body.mobile,
			name: req.body.name,
			gender: req.body.gender,
			email: req.body.email,
			currency: req.body.currency,
			walletAmount: req.body.walletAmount,
			mobile_verified: req.body.mobile_verified,
			email_verified: req.body.email_verified,
			deleted: req.body.deleted,
			//createdBy: req.body.createdBy,
			//createdAt: req.body.createdAt,
			changedBy: req.body.changedBy,
			changedAt: at
		};
		
		Profile.findOneAndUpdate({_id:req.body._id},{$set: updateUserProfile},{},(err, user)=>{
			if(err){
				res.json({statusCode: 'F', msg: 'Failed to update', error: err});
			}
			else{
				res.json({statusCode: 'S', msg: 'Entry updated', updated: user});
			}
		});
	}
};

module.exports.profileDelete = function(req,res){//Delete
	if (!req.payload.user_id) {
		res.status(401).json({
		  "message" : "Unauthorized Access."
		});
	}
	else{
		Profile.remove({_id: req.params.id}, function(err,result){
			if(err){
				res.json(err);
			}
			else{
				res.json(result);
			}
		});
	}
};

///Send OTP
const Otp = mongoose.model('Otp');
module.exports.sendOTP = function(req,res){	
	var mobile = req.query.mobile;
	if(mobile){
		
				var randomNum = Math.floor(1000 + Math.random() * 9000);
				request.post({
					url:'https://api.textlocal.in/send/?', 
					form: {
							  'apikey': 'MN/ELO/CKoU-bT0VHaKrMJ3hPcLreDUlNj90PY0MqC',
							  'message': 'Please use the OTP '+randomNum+' to login.',
							  'sender': 'TXTLCL',
							  'numbers': '91'+mobile
							}
				},
				function(err,httpResponse,body){
					var n = randomNum + "";
					var t = (new Date()).toString();
					var item = {
						mobile: req.query.mobile,
						otp: n,
						time: t
					};
					Otp.update({mobile: req.query.mobile},item,{upsert:true}, function(update_err, update_res){
						res.json({status:"S", response: httpResponse, error: err, body: body, updateError: update_err});
					});
					/*let newOtp = new Otp({
						mobile: req.query.mobile,
						otp: n,
						time: t
					});			
					newOtp.save((err, otp)=>{
						
					});*/
					//res.json({status:"S", response: httpResponse, error: err, body: body});
				});	
		
	}
	else{
		res.json({status:"F", msg:"Invalid Number."});
	}
};

module.exports.loginByOtp = function(req,res){//get mobile & Otp combination
	if(req.query.mobile && req.query.otp){
		var q = {};
		q.mobile = {"$eq":req.query.mobile};
		q.deleted = {"$ne": true};
		Profile.find(q,function(err, users){
			if(users.length > 0){
				var query = {};
				query.mobile = {"$eq":req.query.mobile};
				query.otp = {"$eq":req.query.otp};
				Otp.find(query,function(err_otp, otps){
					if(err_otp){
						res.json({"statusCode":"F","msg":"Unable to validate OTP.","error":err_otp});
					}
					else if(otps.length>0){
						var user = new User();
						user.user_id = users[0].user_id;
						user.mobile = users[0].mobile;
						user.admin = users[0].admin;
						var token = user.generateJwt();
						res.json({
							"statusCode":"S","msg":"Successfully","results":otps,
							"token" : token
						});
					}
					else{
						res.json({"statusCode":"F","msg":"Unable to validate OTP.","error":err_otp});
					}
				});
			}
			else{
				res.json({"statusCode":"F","msg":"Mobile number does not exist."});
			}
		});
	}
	else{
		res.json({"statusCode":"F","msg":"Invalid number and OTP."});
	}
};



//////////////////////////Applications Master Table////////////////////////////////
const Application = mongoose.model('Application');

module.exports.getApplication= function(req,res){//Fetch
	var query = {};
	if(req.query.app_id){
		query.app_id = {"$regex":req.query.app_id, "$options":"i"};
	}
	if(req.query.deleted){
		query.deleted = {"$regex":req.query.deleted, "$options":"i"};
	}
	else{
		query.deleted = {"$ne": true};
	}
	Application.find(query,function(err, application){
		res.json({results: application, error: err});
	});
};
module.exports.addApplication = function(req,res){//Add New
	var app_id = "0";
	Counter.getNextSequenceValue('application',function(sequence){
		if(sequence){
			var index_count = sequence.sequence_value;
			var d = new Date();
			var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
			let newApplication = new Application({
				app_id: "APP_"+(app_id - (-index_count)),
				app_name: req.body.app_name,
				deleted: req.body.deleted,
				createdBy: req.body.createdBy,
				createdAt: at,
				changedBy: req.body.changedBy,
				changedAt: at
			});
			
			newApplication.save((err, application)=>{
				if(err){
					res.json({statusCode: 'F', msg: 'Failed to add', error: err});
				}
				else{
					res.json({statusCode: 'S', msg: 'Entry added', application: application});
				}
			});
		}
		else{
			res.json({statusCode: 'F', msg: 'Unable to generate sequence number.'});
		}
	});
};

module.exports.updateApplication = function(req,res){//Update
	var d = new Date();
	var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
	let updateApplication = {
		_id:req.body._id,
		app_id: req.body.app_id,
		app_name: req.body.app_name,
		deleted: req.body.deleted,
		//createdBy: req.body.createdBy,
		//createdAt: req.body.createdAt,
		changedBy: req.body.changedBy,
		changedAt: at
	};
	
	Application.findOneAndUpdate({_id:req.body._id},{$set: updateApplication},{},(err, application)=>{
		if(err){
			res.json({statusCode: 'F', msg: 'Failed to update', error: err});
		}
		else{
			res.json({statusCode: 'S', msg: 'Entry updated', updated: application});
		}
	});
};

module.exports.deleteApplication = function(req,res){//Delete
	Application.remove({_id: req.params.id}, function(err,result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
};


//////////////////////////Roles Master Table////////////////////////////////
const Role = mongoose.model('Role');

module.exports.getRole = function(req,res){//Fetch
	var query = {};
	if(req.query.role_id){
		query.role_id = {"$regex":req.query.role_id, "$options":"i"};
	}
	Role.find(query,function(err, role){
		res.json({results: role, error: err});
	});
};
module.exports.addRole = function(req,res){//Add New
	var role_id = "0";
	Counter.getNextSequenceValue('role',function(sequence){
		if(sequence){
			var index_count = sequence.sequence_value;
			var d = new Date();
			var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
			let newRole = new Role({
				role_id: "ROLE_"+(role_id - (-index_count)),
				role_name: req.body.role_name,
				deleted:false,
				createdBy:"",
				createdAt: at,
				changedBy:"",
				changedAt: at
			});
			
			newRole.save((err, role)=>{
				if(err){
					res.json({statusCode: 'F', msg: 'Failed to add', error: err});
				}
				else{
					res.json({statusCode: 'S', msg: 'Entry added', role: role});
				}
			});
		}
		else{
			res.json({statusCode: 'F', msg: 'Unable to generate sequence number.'});
		}
	});
};

module.exports.updateRole = function(req,res){//Update
	var d = new Date();
	var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
	let updateRole = {
		_id:req.body._id,
		role_id: req.body.role_id,
		role_name: req.body.role_name,
		deleted: req.body.deleted,
		createdBy: req.body.createdBy,
		createdAt: req.body.createdAt,
		changedBy:"",
		changedAt: at
	};
	
	Role.findOneAndUpdate({_id:req.body._id},{$set: updateRole},{},(err, role)=>{
		if(err){
			res.json({statusCode: 'F', msg: 'Failed to update', error: err});
		}
		else{
			res.json({statusCode: 'S', msg: 'Entry updated', updated: role});
		}
	});
};

module.exports.deleteRole = function(req,res){//Delete
	Role.remove({_id: req.params.id}, function(err,result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
};



//////////////////////////Subscription Master Table////////////////////////////////
const Subscription = mongoose.model('Subscription');

module.exports.getSubscription = function(req,res){//Fetch
	var query = {};
	if(req.query.subscription_id){
		query.subscription_id = {"$regex":req.query.subscription_id, "$options":"i"};
	}
	if(req.query.app_name){
		query.app_name = {"$regex":req.query.app_name, "$options":"i"};
	}
	if(req.query.deleted){
		query.deleted = {"$regex":req.query.deleted, "$options":"i"};
	}
	else{
		query.deleted = {"$ne": true};
	}
	Subscription.find(query,function(err, result){
		res.json({results: result, error: err});
	});
};
module.exports.addSubscription = function(req,res){//Add New
	var subscription_id = "0";
	Counter.getNextSequenceValue('subscription',function(sequence){
		if(sequence){
			var index_count = sequence.sequence_value;
			var d = new Date();
			var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
			let newSubscription = new Subscription({
				subscription_id: "SUBSCR_"+(subscription_id - (-index_count)),
				app_name: req.body.app_name,
				subscription_name: req.body.subscription_name,
				role_id: req.body.role_id,
				validity_unit: req.body.validity_unit,
				validity_period: req.body.validity_period,
				amount: req.body.amount,
				currency: req.body.currency,
				post_allowed: req.body.post_allowed,
				post_day: req.body.post_day,
				post_priority: req.body.post_priority,
				featureOnTop: req.body.featureOnTop,
				getHighlighted: req.body.getHighlighted,
				notification_sms: req.body.notification_sms,
				notification_email: req.body.notification_email,
				notification_app: req.body.notification_app,
				createdBy: req.body.createdBy,
				createdAt: at,
				changedBy: req.body.changedBy,
				changedAt: at,
				deleted: req.body.deleted
			});
			
			newSubscription.save((err, subscription)=>{
				if(err){
					res.json({statusCode: 'F', msg: 'Failed to add', error: err});
				}
				else{
					res.json({statusCode: 'S', msg: 'Entry added', subscription: subscription});
				}
			});
		}
		else{
			res.json({statusCode: 'F', msg: 'Unable to generate sequence number.'});
		}
	});
};
module.exports.updateSubscription = function(req,res){//Update
	var d = new Date();
	var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
	let updateSubscription = {
		_id:req.body._id,
		subscription_id: req.body.subscription_id,
		app_name: req.body.app_name,
		subscription_name: req.body.subscription_name,
		role_id: req.body.role_id,
		validity_unit: req.body.validity_unit,
		validity_period: req.body.validity_period,
		amount: req.body.amount,
		currency: req.body.currency,
		post_allowed: req.body.post_allowed,
		post_day: req.body.post_day,
		post_priority: req.body.post_priority,
		featureOnTop: req.body.featureOnTop,
		getHighlighted: req.body.getHighlighted,
		notification_sms: req.body.notification_sms,
		notification_email: req.body.notification_email,
		notification_app: req.body.notification_app,
		//createdBy: req.body.createdBy,
		//createdAt: req.body.createdAt,
		changedBy: req.body.changedBy,
		changedAt: at,
		deleted: req.body.deleted
	};
	
	Subscription.findOneAndUpdate({_id:req.body._id},{$set: updateSubscription},{},(err, subscription)=>{
		if(err){
			res.json({statusCode: 'F', msg: 'Failed to update', error: err});
		}
		else{
			res.json({statusCode: 'S', msg: 'Entry updated', updated: subscription});
		}
	});
};

module.exports.deleteSubscription = function(req,res){//Delete
	Subscription.remove({_id: req.params.id}, function(err,result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
};


//////////////////////////Screen Master Table////////////////////////////////
const Screen = mongoose.model('Screen');

module.exports.getScreen = function(req,res){//Fetch
	var query = {};
	if(req.query.screen){
		query.screen = {"$regex":req.query.screen, "$options":"i"};
	}
	Screen.find(query,function(err, result){
		res.json({results: result, error: err});
	});
};
module.exports.addScreen = function(req,res){//Add New
	let newScreen = new Screen({
		screen: req.body.screen
	});
	
	newScreen.save((err, screen)=>{
		if(err){
			res.json({statusCode: 'F', msg: 'Failed to add', error: err});
		}
		else{
			res.json({statusCode: 'S', msg: 'Entry added', screen: screen});
		}
	});
};
module.exports.updateScreen = function(req,res){//Update
	let updateScreen = {
		_id:req.body._id,
		screen: req.body.screen
	};
	
	Screen.findOneAndUpdate({_id:req.body._id},{$set: updateScreen},{},(err, screen)=>{
		if(err){
			res.json({statusCode: 'F', msg: 'Failed to update', error: err});
		}
		else{
			res.json({statusCode: 'S', msg: 'Entry updated', updated: screen});
		}
	});
};

module.exports.deleteScreen = function(req,res){//Delete
	Screen.remove({_id: req.params.id}, function(err,result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
};



//////////////////////////Field Master Table////////////////////////////////
const Field = mongoose.model('Field');

module.exports.getField = function(req,res){//Fetch
	var query = {};
	if(req.query.field){
		query.field = {"$regex":req.query.field, "$options":"i"};
	}
	Field.find(query,function(err, result){
		res.json({results: result, error: err});
	});
};
module.exports.addField = function(req,res){//Add New
	let newField = new Field({
		field: req.body.field,
		type: req.body.type,
		path: req.body.path,
		source: req.body.source,
		required: req.body.required,
		category: req.body.category,
		sequence: req.body.sequence,
		for_filter: req.body.for_filter,
		from_config: req.body.from_config
	});
	
	newField.save((err, field)=>{
		if(err){
			res.json({statusCode: 'F', msg: 'Failed to add', error: err});
		}
		else{
			res.json({statusCode: 'S', msg: 'Entry added', field: field});
		}
	});
};
module.exports.updateField = function(req,res){//Update
	let updateField = {
		_id:req.body._id,
		field: req.body.field,
		type: req.body.type,
		path: req.body.path,
		source: req.body.source,
		required: req.body.required,
		category: req.body.category,
		sequence: req.body.sequence,
		for_filter: req.body.for_filter,
		from_config: req.body.from_config
	};
	
	Field.findOneAndUpdate({_id:req.body._id},{$set: updateField},{},(err, field)=>{
		if(err){
			res.json({statusCode: 'F', msg: 'Failed to update', error: err});
		}
		else{
			res.json({statusCode: 'S', msg: 'Entry updated', updated: field});
		}
	});
};

module.exports.deleteField = function(req,res){//Delete
	Field.remove({_id: req.params.id}, function(err,result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
};

//////////////////////////Screen Field Rights Config Table////////////////////////////////
const AppScrFieldsRights = mongoose.model('AppScrFieldsRights');

module.exports.getAppScrFieldsRights = function(req,res){//Fetch
	var query = {};
	if(req.query.screen){
		query.screen = {"$regex":req.query.screen, "$options":"i"};
	}
	if(req.query.field){
		query.field = {"$regex":req.query.field, "$options":"i"};
	}
	if(req.query.app_id){
		query.app_id = {"$regex":req.query.app_id, "$options":"i"};
	}
	if(req.query.deleted){
		query.deleted = {"$regex":req.query.deleted, "$options":"i"};
	}
	else{
		query.deleted = {"$ne": true};
	}
	AppScrFieldsRights.find(query,function(err, result){
		res.json({results: result, error: err});
	});
};
module.exports.addAppScrFieldsRights = function(req,res){//Add New
	var d = new Date();
	var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
	let newAppScrFieldsRights = new AppScrFieldsRights({
		subscription_id: req.body.subscription_id,
		role_id: req.body.role_id,
		app_id: req.body.app_id,
		screen: req.body.screen,
		screen_sequence: req.body.screen_sequence,
		screen_for_nav: req.body.screen_for_nav,
		applicable: req.body.applicable,
		field: req.body.field,
		field_type: req.body.field_type,
		field_path: req.body.field_path,
		field_source: req.body.field_source,
		field_required: req.body.field_required,
		field_category: req.body.field_category,
		field_sequence: req.body.field_sequence,
		field_for_filter: req.body.field_for_filter,
		field_from_config: req.body.field_from_config,
		create: req.body.create,
		edit: req.body.edit,
		delete: req.body.delete,
		visible: req.body.visible,
		editable: req.body.editable,
		createdBy: req.payload.user_id,
		createdAt: at,
		changedBy: req.payload.user_id,
		changedAt: at,
		deleted: req.body.deleted
	});
	
	newAppScrFieldsRights.save((err, appRights)=>{
		if(err){
			res.json({statusCode: 'F', msg: 'Failed to add', error: err});
		}
		else{
			res.json({statusCode: 'S', msg: 'Entry added', appRights: appRights});
		}
	});
};
module.exports.updateAppScrFieldsRights = function(req,res){//Update
	var d = new Date();
	var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
	let updateAppScrFieldsRights = {
		_id:req.body._id,
		subscription_id: req.body.subscription_id,
		role_id: req.body.role_id,
		app_id: req.body.app_id,
		screen: req.body.screen,
		screen_sequence: req.body.screen_sequence,
		screen_for_nav: req.body.screen_for_nav,
		applicable: req.body.applicable,
		field: req.body.field,
		field_type: req.body.field_type,
		field_path: req.body.field_path,
		field_source: req.body.field_source,
		field_required: req.body.field_required,
		field_category: req.body.field_category,
		field_sequence: req.body.field_sequence,
		field_for_filter: req.body.field_for_filter,
		field_from_config: req.body.field_from_config,
		create: req.body.create,
		edit: req.body.edit,
		delete: req.body.delete,
		visible: req.body.visible,
		editable: req.body.editable,
		//createdBy: req.body.createdBy,
		//createdAt: req.body.createdAt,
		changedBy: req.payload.user_id,
		changedAt: at,
		deleted: req.body.deleted
	};
	
	AppScrFieldsRights.findOneAndUpdate({_id:req.body._id},{$set: updateAppScrFieldsRights},{},(err, appRights)=>{
		if(err){
			res.json({statusCode: 'F', msg: 'Failed to update', error: err});
		}
		else{
			res.json({statusCode: 'S', msg: 'Entry updated', updated: appRights});
		}
	});
};

module.exports.deleteAppScrFieldsRights = function(req,res){//Delete
	AppScrFieldsRights.remove({_id: req.params.id}, function(err,result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
};

module.exports.getAppScrRights = function(req,res){//Fetch Screen Rights
	var query = {"field": {"$regex": "-", "$options":"i"}};
	if(req.query.app_id){
		query.app_id = {"$regex":req.query.app_id, "$options":"i"};
	}
	if(req.query.role_id){
		query.role_id = {"$regex":req.query.role_id, "$options":"i"};
	}
	if(req.query.deleted){
		query.deleted = {"$regex":req.query.deleted, "$options":"i"};
	}
	else{
		query.deleted = {"$ne": true};
	}
	AppScrFieldsRights.find(query,function(err, result){
		res.json({results: result, error: err});
	});
};
module.exports.getAppFieldRights = function(req,res){//Fetch Field Rights
	var query = {"field": {"$ne": "-"}};
	if(req.query.app_id){
		query.app_id = {"$regex":req.query.app_id, "$options":"i"};
	}
	if(req.query.screen){
		query.screen = {"$regex":req.query.screen, "$options":"i"};
	}
	if(req.query.role_id){
		query.role_id = {"$regex":req.query.role_id, "$options":"i"};
	}
	if(req.query.deleted){
		query.deleted = {"$regex":req.query.deleted, "$options":"i"};
	}
	else{
		query.deleted = {"$ne": true};
	}
	AppScrFieldsRights.find(query,function(err, result){
		res.json({results: result, error: err});
	});
};
module.exports.updateMultipleRights = function(req,res){//Update Multiple 
	var records = req.body.rights;
	var results = [];
	var doc_save = [];
	var doc_update = [];
	for(var count=0; count<records.length; count++){
		var doc = records[count];
		var d = new Date();
		doc.changedAt = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
		if(doc._id){
			delete doc.createdBy;
			delete doc.createdAt;
			doc_update.push(doc);
		}
		else{
			delete doc._id;
			doc.createdAt = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
			doc_save.push(doc);
		}
	}
	if(doc_update.length>0){
		async.each(doc_update, function(item, next){
				AppScrFieldsRights.update({_id:item._id},item,{upsert:true}, function(update_err, update_res){
						results.push(update_res);
						next(null, null);
				});
		},
		function(err){
				//console.log(err);
				//console.log(doc_save);
				AppScrFieldsRights.insertMany(doc_save, function(add_err, add_res){
						//console.log(add_res);
						//console.log(add_err);
						results.push(add_res);
						res.json({results: results, error: err});
				});				
		   //console.log(err);
		   //res.json({results: results, error: err});
		});
	}
	else{
		AppScrFieldsRights.insertMany(doc_save, function(add_err, add_res){
			results.push(add_res);
			res.json({results: results, error: add_err});
		});	
	}
	
	
	
	
	
/*
	async.each(records, function(doc, next){
		var d = new Date();
		doc.changedAt = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
		if(doc._id){
			delete doc.createdBy;
			delete doc.createdAt;
			AppScrFieldsRights.update({_id:doc._id},doc,{upsert:true}, function(err, update_res){
				results.push(update_res);
				next(null, null);
			});
			console.log(doc);
		}
		else{
			delete doc._id;
			doc.createdAt = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
			let newDoc = new AppScrFieldsRights(doc);
			newDoc.save((err, add_res)=>{
				results.push(add_res);
				next(null, null);
			});
			console.log(doc);
		}
		
		
    },
	function(err){
       //console.log(err);
	   res.json({results: results, error: err});
    });*/
		
};


//////////////////////////Product Type Table////////////////////////////////
const ProductTyp = mongoose.model('ProductTyp');

module.exports.getProductTyp = function(req,res){//Fetch
	var query = {};
	if(req.query.product_type_id){
		query.product_type_id = {"$regex":req.query.product_type_id, "$options":"i"};
	}
	if(req.query.deleted){
		query.deleted = {"$regex":req.query.deleted, "$options":"i"};
	}
	else{
		query.deleted = {"$ne": true};
	}
	ProductTyp.find(query,function(err, productTyp){
		res.json({results: productTyp, error: err});
	});
};
module.exports.addProductTyp = function(req,res){//Add New
	var product_type_id = "0";
	Counter.getNextSequenceValue('product_type',function(sequence){
		if(sequence){
			var index_count = sequence.sequence_value;
			var d = new Date();
			var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
			let newProductTyp = new ProductTyp({
				product_type_id: "PRDTYP_"+(product_type_id - (-index_count)),
				product_type_name: req.body.product_type_name,
				deleted: req.body.deleted,
				createdBy: req.payload.user_id,
				createdAt: at,
				changedBy: req.payload.user_id,
				changedAt: at
			});
			
			newProductTyp.save((err, productTyp)=>{
				if(err){
					res.json({statusCode: 'F', msg: 'Failed to add', error: err});
				}
				else{
					res.json({statusCode: 'S', msg: 'Entry added', productTyp: productTyp});
				}
			});
		}
		else{
			res.json({statusCode: 'F', msg: 'Unable to generate sequence number.'});
		}
	});
};

module.exports.updateProductTyp = function(req,res){//Update
	var d = new Date();
	var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
	let updateProductTyp = {
		_id:req.body._id,
		product_type_id: req.body.product_type_id,
		product_type_name: req.body.product_type_name,
		deleted: req.body.deleted,
		//createdBy: req.body.createdBy,
		//createdAt: req.body.createdAt,
		changedBy: req.payload.user_id,
		changedAt: at
	};
	
	ProductTyp.findOneAndUpdate({_id:req.body._id},{$set: updateProductTyp},{},(err, productTyp)=>{
		if(err){
			res.json({statusCode: 'F', msg: 'Failed to update', error: err});
		}
		else{
			res.json({statusCode: 'S', msg: 'Entry updated', updated: productTyp});
		}
	});
};

module.exports.deleteProductTyp = function(req,res){//Delete
	ProductTyp.remove({_id: req.params.id}, function(err,result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
};

//////////////////////////Product Hierarchy Table////////////////////////////////
const ProductHierarchy = mongoose.model('ProductHierarchy');

module.exports.getProductHierarchy = function(req,res){//Fetch
	var query = {"deleted": {"$ne": true}};
	if(req.query.product_hierarchy_id){
		query.product_hierarchy_id = {"$regex":req.query.product_hierarchy_id, "$options":"i"};
	}
	if(req.query.deleted){
		query.deleted = {"$regex":req.query.deleted, "$options":"i"};
	}
	else{
		query.deleted = {"$ne": true};
	}
	ProductHierarchy.find(query,function(err, productHierarchy){
		res.json({results: productHierarchy, error: err});
	});
};
module.exports.addProductHierarchy = function(req,res){//Add New
	var product_hierarchy_id = "0";
	Counter.getNextSequenceValue('prdHierarchy',function(sequence){
		if(sequence){
			var index_count = sequence.sequence_value;
			var d = new Date();
			var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
			let newProductHierarchy = new ProductHierarchy({
				parent_product_hierarchy_id: req.body.parent_product_hierarchy_id,
				product_hierarchy_id: "PRDHIERARCHY_"+(product_hierarchy_id - (-index_count)),
				product_type_id: req.body.product_type_id,
				product_type_name: req.body.product_type_name,
				child_product_hierarchy_id: req.body.child_product_hierarchy_id,
				deleted: req.body.deleted,
				createdBy: req.payload.user_id,
				createdAt: at,
				changedBy: req.payload.user_id,
				changedAt: at
			});
			
			newProductHierarchy.save((err, productHierarchy)=>{
				if(err){
					res.json({statusCode: 'F', msg: 'Failed to add', error: err});
				}
				else{
					res.json({statusCode: 'S', msg: 'Entry added', productHierarchy: productHierarchy});
				}
			});
		}
		else{
			res.json({statusCode: 'F', msg: 'Unable to generate sequence number.'});
		}
	});
};

module.exports.updateProductHierarchy = function(req,res){//Update
	var d = new Date();
	var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
	let updateProductHierarchy = {
		_id:req.body._id,
		parent_product_hierarchy_id: req.body.parent_product_hierarchy_id,
		product_hierarchy_id: req.body.product_hierarchy_id,
		product_type_id: req.body.product_type_id,
		product_type_name: req.body.product_type_name,
		child_product_hierarchy_id: req.body.child_product_hierarchy_id,
		deleted: req.body.deleted,
		//createdBy: req.body.createdBy,
		//createdAt: req.body.createdAt,
		changedBy: req.payload.user_id,
		changedAt: at
	};
	
	ProductHierarchy.findOneAndUpdate({_id:req.body._id},{$set: updateProductHierarchy},{},(err, productHierarchy)=>{
		if(err){
			res.json({statusCode: 'F', msg: 'Failed to update', error: err});
		}
		else{
			res.json({statusCode: 'S', msg: 'Entry updated', updated: productHierarchy});
		}
	});
};

module.exports.deleteProductHierarchy = function(req,res){//Delete
	ProductHierarchy.remove({_id: req.params.id}, function(err,result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
};

module.exports.updateMultiProductHierarchy = function(req,res){//Update Multiple 
	var records = req.body.prdHierarchy;
	var results = [];
	async.each(records, function(doc, next){
		var d = new Date();
		doc.changedAt = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
		delete doc.createdBy;
		delete doc.createdAt;
		ProductHierarchy.update({_id:doc._id},{$set: doc},{upsert:true}, function(err, res){
			results.push(res);
			next(null, null);
		})
    },
	function(err){
       //console.log(err);
	   res.json({results: results, error: err});
    });
		
};



//////////////////////////Specification Field Table////////////////////////////////
const SpecField = mongoose.model('SpecField');

module.exports.getSpecField = function(req,res){//Fetch
	var query = {};
	if(req.query.specification_field_id){
		query.specification_field_id = {"$regex":req.query.specification_field_id, "$options":"i"};
	}
	if(req.query.deleted){
		query.deleted = {"$regex":req.query.deleted, "$options":"i"};
	}
	else{
		query.deleted = {"$ne": true};
	}
	SpecField.find(query,function(err, specField){
		res.json({results: specField, error: err});
	});
};
module.exports.addSpecField = function(req,res){//Add New
	var specification_field_id = "0";
	Counter.getNextSequenceValue('specification_field',function(sequence){
		if(sequence){
			var index_count = sequence.sequence_value;
			var d = new Date();
			var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
			let newSpecField = new SpecField({
				specification_field_id: "SPECFIELD_"+(specification_field_id - (-index_count)),
				specification_field_name: req.body.specification_field_name,
				deleted: req.body.deleted,
				createdBy: req.payload.user_id,
				createdAt: at,
				changedBy: req.payload.user_id,
				changedAt: at
			});
			
			newSpecField.save((err, specField)=>{
				if(err){
					res.json({statusCode: 'F', msg: 'Failed to add', error: err});
				}
				else{
					res.json({statusCode: 'S', msg: 'Entry added', specField: specField});
				}
			});
		}
		else{
			res.json({statusCode: 'F', msg: 'Unable to generate sequence number.'});
		}
	});
};

module.exports.updateSpecField = function(req,res){//Update
	var d = new Date();
	var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
	let updateSpecField = {
		_id:req.body._id,
		specification_field_id: req.body.specification_field_id,
		specification_field_name: req.body.specification_field_name,
		deleted: req.body.deleted,
		//createdBy: req.body.createdBy,
		//createdAt: req.body.createdAt,
		changedBy: req.payload.user_id,
		changedAt: at
	};
	
	SpecField.findOneAndUpdate({_id:req.body._id},{$set: updateSpecField},{},(err, specField)=>{
		if(err){
			res.json({statusCode: 'F', msg: 'Failed to update', error: err});
		}
		else{
			res.json({statusCode: 'S', msg: 'Entry updated', updated: specField});
		}
	});
};

module.exports.deleteSpecField = function(req,res){//Delete
	SpecField.remove({_id: req.params.id}, function(err,result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
};

//////////////////////////Product Type & Specification Field Mapping Table////////////////////////////////
const PrdTypSpecFieldMap = mongoose.model('PrdTypSpecFieldMap');

module.exports.getPrdTypSpecFieldMap = function(req,res){//Fetch
	var query = {};
	if(req.query.product_type_id){
		query.product_type_id = {"$regex":req.query.product_type_id, "$options":"i"};
	}
	if(req.query.deleted){
		query.deleted = {"$regex":req.query.deleted, "$options":"i"};
	}
	else{
		query.deleted = {"$ne": true};
	}
	PrdTypSpecFieldMap.find(query,function(err, prdTypSpecFieldMap){
		res.json({results: prdTypSpecFieldMap, error: err});
	});
};
module.exports.addPrdTypSpecFieldMap = function(req,res){//Add New
		var d = new Date();
		var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
		let newPrdTypSpecFieldMap = new PrdTypSpecFieldMap({
			product_type_id: req.body.product_type_id,
			product_type_name: req.body.product_type_name,
			specification_field_id: req.body.specification_field_id,
			specification_field_name: req.body.specification_field_name,
			deleted: req.body.deleted,
			createdBy: req.payload.user_id,
			createdAt: at,
			changedBy: req.payload.user_id,
			changedAt: at
		});
		
		newPrdTypSpecFieldMap.save((err, prdTypSpecFieldMap)=>{
			if(err){
				res.json({statusCode: 'F', msg: 'Failed to add', error: err});
			}
			else{
				res.json({statusCode: 'S', msg: 'Entry added', prdTypSpecFieldMap: prdTypSpecFieldMap});
			}
		});
};

module.exports.updatePrdTypSpecFieldMap = function(req,res){//Update
	var d = new Date();
	var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
	let updatePrdTypSpecFieldMap = {
		_id:req.body._id,
		product_type_id: req.body.product_type_id,
		product_type_name: req.body.product_type_name,
		specification_field_id: req.body.specification_field_id,
		specification_field_name: req.body.specification_field_name,
		deleted: req.body.deleted,
		//createdBy: req.body.createdBy,
		//createdAt: req.body.createdAt,
		changedBy: req.payload.user_id,
		changedAt: at
	};
	
	PrdTypSpecFieldMap.findOneAndUpdate({_id:req.body._id},{$set: updatePrdTypSpecFieldMap},{},(err, prdTypSpecFieldMap)=>{
		if(err){
			res.json({statusCode: 'F', msg: 'Failed to update', error: err});
		}
		else{
			res.json({statusCode: 'S', msg: 'Entry updated', updated: prdTypSpecFieldMap});
		}
	});
};

module.exports.deletePrdTypSpecFieldMap = function(req,res){//Delete
	PrdTypSpecFieldMap.remove({_id: req.params.id}, function(err,result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
};


//////////////////////////Brand Table////////////////////////////////
const Brand = mongoose.model('Brand');

module.exports.getBrand = function(req,res){//Fetch
	var query = {};
	if(req.query.brand_id){
		query.brand_id = {"$regex":req.query.brand_id, "$options":"i"};
	}
	if(req.query.deleted){
		query.deleted = {"$regex":req.query.deleted, "$options":"i"};
	}
	else{
		query.deleted = {"$ne": true};
	}
	Brand.find(query,function(err, brand){
		res.json({results: brand, error: err});
	});
};
module.exports.addBrand = function(req,res){//Add New
	var brand_id = "0";
	Counter.getNextSequenceValue('brand',function(sequence){
		if(sequence){
			var index_count = sequence.sequence_value;
			var d = new Date();
			var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
			let newBrand = new Brand({
				brand_id: "BRAND_"+(brand_id - (-index_count)),
				brand_name: req.body.brand_name,
				deleted: req.body.deleted,
				createdBy: req.payload.user_id,
				createdAt: at,
				changedBy: req.payload.user_id,
				changedAt: at
			});
			
			newBrand.save((err, brand)=>{
				if(err){
					res.json({statusCode: 'F', msg: 'Failed to add', error: err});
				}
				else{
					res.json({statusCode: 'S', msg: 'Entry added', brand: brand});
				}
			});
		}
		else{
			res.json({statusCode: 'F', msg: 'Unable to generate sequence number.'});
		}
	});
};

module.exports.updateBrand = function(req,res){//Update
	var d = new Date();
	var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
	let updateBrand = {
		_id:req.body._id,
		brand_id: req.body.brand_id,
		brand_name: req.body.brand_name,
		deleted: req.body.deleted,
		//createdBy: req.body.createdBy,
		//createdAt: req.body.createdAt,
		changedBy: req.payload.user_id,
		changedAt: at
	};
	
	Brand.findOneAndUpdate({_id:req.body._id},{$set: updateBrand},{},(err, brand)=>{
		if(err){
			res.json({statusCode: 'F', msg: 'Failed to update', error: err});
		}
		else{
			res.json({statusCode: 'S', msg: 'Entry updated', updated: brand});
		}
	});
};

module.exports.deleteBrand = function(req,res){//Delete
	Brand.remove({_id: req.params.id}, function(err,result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
};


//////////////////////////Product Table////////////////////////////////
const Product = mongoose.model('Product');

module.exports.getProduct = function(req,res){//Fetch
	var query = {};
	if(req.query.product_id){
		query.product_id = {"$regex":req.query.product_id, "$options":"i"};
	}
	if(req.query.product_type_id){
		query.product_type_id = {"$regex":req.query.product_type_id, "$options":"i"};
	}
	if(req.query.brand_id){
		query.brand_id = {"$regex":req.query.brand_id, "$options":"i"};
	}
	if(req.query.brand_name){
		query.brand_name = {"$eq":req.query.brand_name};
	}
	if(req.query.deleted){
		query.deleted = {"$regex":req.query.deleted, "$options":"i"};
	}
	else{
		query.deleted = {"$ne": true};
	}
	Product.find(query,function(err, product){
		res.json({results: product, error: err});
	});
};
module.exports.addProduct = function(req,res){//Add New
	var product_id = req.body.product_type_name +"_"+ req.body.brand_name +"_"+ req.body.model +"_"+ req.body.variant;
		var d = new Date();
		var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
		let newProduct = new Product({
			product_id: product_id,
			product_type_id: req.body.product_type_id,
			product_type_name: req.body.product_type_name,
			brand_id: req.body.brand_id,
			brand_name: req.body.brand_name,
			model: req.body.model,
			variant: req.body.variant,
			image_path: req.body.image_path,
			deleted: req.body.deleted,
			createdBy: req.payload.user_id,
			createdAt: at,
			changedBy: req.payload.user_id,
			changedAt: at
		});
		
		newProduct.save((err, product)=>{
			if(err){
				res.json({statusCode: 'F', msg: 'Failed to add', error: err});
			}
			else{
				res.json({statusCode: 'S', msg: 'Entry added', product: product});
			}
		});
};

module.exports.updateProduct = function(req,res){//Update
	var d = new Date();
	var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
	let updateProduct = {
		_id:req.body._id,
		product_id: req.body.product_id,
		product_type_id: req.body.product_type_id,
		product_type_name: req.body.product_type_name,
		brand_id: req.body.brand_id,
		brand_name: req.body.brand_name,
		model: req.body.model,
		variant: req.body.variant,
		image_path: req.body.image_path,
		deleted: req.body.deleted,
		//createdBy: req.body.createdBy,
		//createdAt: req.body.createdAt,
		changedBy: req.payload.user_id,
		changedAt: at
	};
	
	Product.findOneAndUpdate({_id:req.body._id},{$set: updateProduct},{},(err, product)=>{
		if(err){
			res.json({statusCode: 'F', msg: 'Failed to update', error: err});
		}
		else{
			res.json({statusCode: 'S', msg: 'Entry updated', updated: product});
		}
	});
};

module.exports.deleteProduct = function(req,res){//Delete
	Product.remove({_id: req.params.id}, function(err,result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
};

module.exports.getServiceProduct = function(req,res){//Fetch
	var query = {};
	
	query.product_type_name = {"$regex":"Service", "$options":"i"};
	
	if(req.query.brand_id){
		query.brand_id = {"$regex":req.query.brand_id, "$options":"i"};
	}
	if(req.query.deleted){
		query.deleted = {"$regex":req.query.deleted, "$options":"i"};
	}
	else{
		query.deleted = {"$ne": true};
	}
	Product.find(query,function(err, product){
		res.json({results: product, error: err});
	});
};

module.exports.getUniqueBrandBasedOnPrdTyp = function(req,res){//Fetch
	var query = {};
	query.product_type_id = {"$eq":req.query.product_type_id};
	query.deleted = {"$ne": true};
	Product.find(query).distinct( "brand_name",function(err, brands){
		res.json({results: brands, error: err});
	});
	
	/*Product.find(query,function(err, product){
		res.json({results: product, error: err});
	});*/
};








module.exports.validateUploadData = function(req,res){//Validation
	var hasDiscrepancy = false;
	var validation_result = [];
	var loopCount = 0;
	var docs = JSON.parse(JSON.stringify(req.body.docs.data));
	if(!docs)
		res.json({statusCode: 'F', msg: 'Invalid file.'});
	if(docs.length<1)
		res.json({statusCode: 'F', msg: 'No data found in the sheet.'});
	
	if(req.body.docs.sheet === 'Product'){
		docs.forEach(function(currentItem, index, arr){
			var item = JSON.parse(JSON.stringify(currentItem));
			ProductTyp.find({product_type_name:{"$eq":currentItem.product_type_name}},function(productTyp_err, productTyp){
				if(productTyp_err || productTyp.length===0){
					item.msg = 'Invalid Product Type';
					hasDiscrepancy = true;
				}
				else{
					item.product_type_id = productTyp[0].product_type_id;
				}
				
				Brand.find({brand_name:{"$eq":currentItem.brand_name}},function(brand_err, brand){
					if(brand_err || brand.length===0){
						if(item.msg)
							item.msg = item.msg + ', Invalid Brand';
						else
							item.msg = 'Invalid Brand';
						
						hasDiscrepancy = true;
					}
					else{
						item.brand_id = brand[0].brand_id;
					}
					
					var prd_id = ""+ currentItem.product_type_name +"_"+ currentItem.brand_name +"_"+ currentItem.model +"_"+ currentItem.variant;
					Product.find({product_id:{"$eq":prd_id}},function(product_err, product){
						if(!product_err && product.length>0){
							item.msg = 'Product already exist.';
							hasDiscrepancy = true;
						}
						
						validation_result.push(item);
						loopCount = loopCount - (-1);
						
						if(loopCount === docs.length){
							if(hasDiscrepancy)
								res.json({statusCode: 'F', msg: 'Data discrepancy found. Please verify the sheet and upload again.', results: validation_result});
							else
								res.json({statusCode: 'S', msg: 'Successfully validated.', results: validation_result});
						}
					});
				});
			});
		});
	}
	else if(req.body.docs.sheet === 'Specification'){
		var PrdTypSpecFieldMap = mongoose.model('PrdTypSpecFieldMap');
		docs.forEach(function(currentItem, index, arr){
			var item = JSON.parse(JSON.stringify(currentItem));					
			var prd_id = ""+ currentItem.product_type_name +"_"+ currentItem.brand_name +"_"+ currentItem.model +"_"+ currentItem.variant;
			Product.find({product_id:{"$eq":prd_id}},function(product_err, product){
				if(product_err || product.length<1){
					item.msg = 'Product does not exist.';
					hasDiscrepancy = true;
				}
				
				PrdTypSpecFieldMap.find({product_type_name:{"$eq":currentItem.product_type_name}},function(productTypSpec_err, productTypSpec){
					if(productTypSpec_err || productTypSpec.length===0){
						if(item.msg)
							item.msg = item.msg +', Invalid Product Type Specification';
						else
							item.msg = 'Invalid Product Type Specification';
						hasDiscrepancy = true;
					}
					else{
						item.specification_field_id = productTypSpec[0].specification_field_id;
					}
						
					validation_result.push(item);
					loopCount = loopCount - (-1);
					
					if(loopCount === docs.length){
						if(hasDiscrepancy)
							res.json({statusCode: 'F', msg: 'Data discrepancy found. Please verify the sheet and upload again.', results: validation_result});
						else
							res.json({statusCode: 'S', msg: 'Successfully validated.', results: validation_result});
					}
				});
			});
		});
	}
	else if(req.body.docs.sheet === 'Image'){
		docs.forEach(function(currentItem, index, arr){
			var item = JSON.parse(JSON.stringify(currentItem));					
			//var prd_id = ""+ currentItem.product_type_name +"_"+ currentItem.brand_name +"_"+ currentItem.model +"_"+ currentItem.variant;
			Product.find({product_id:{"$eq": currentItem.product_id}},function(product_err, product){
				if(product_err || product.length<1){
					if(item.msg)
						item.msg = item.msg + ', Product does not exist.';
					else
						item.msg = 'Product does not exist.';
					hasDiscrepancy = true;
				}
						
				validation_result.push(item);
				loopCount = loopCount - (-1);
				
				if(loopCount === docs.length){
					if(hasDiscrepancy)
						res.json({statusCode: 'F', msg: 'Data discrepancy found. Please verify the sheet and upload again.', results: validation_result});
					else
						res.json({statusCode: 'S', msg: 'Successfully validated.', results: validation_result});
				}
			});
		});
	}
};





module.exports.addMultipleProduct = function(req,res){//Add New
	var products = [];
	var d = new Date();
	var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
	var docs = req.body.docs;
	docs.forEach(function(currentItem, index, arr){
		var product_id = ""+ currentItem.product_type_name +"_"+ currentItem.brand_name +"_"+ currentItem.model +"_"+ currentItem.variant;
		var newProduct = {
						product_id: product_id,
						product_type_id: currentItem.product_type_id,
						product_type_name: currentItem.product_type_name,
						brand_id: currentItem.brand_id,
						brand_name: currentItem.brand_name,
						model: currentItem.model,
						variant: currentItem.variant,
						//image_path: currentItem.image_path,
						deleted: false,
						createdBy: req.payload.user_id,
						createdAt: at,
						changedBy: req.payload.user_id,
						changedAt: at
		};			
		products.push(newProduct);
	});
		
		Product.insertMany(products, function(err, results) {
			if(err){
				res.json({statusCode: 'F', msg: 'Failed to add', error: err});
			}
			else{
				res.json({statusCode: 'S', msg: 'Entries added', results: results});
			}
		});

};












//////////////////////////Product Specification Table////////////////////////////////
const ProductSpec = mongoose.model('ProductSpec');

module.exports.getProductSpec = function(req,res){//Fetch
	var query = {};
	if(req.query.product_id){
		query.product_id = {"$regex":req.query.product_id, "$options":"i"};
	}
	if(req.query.deleted){
		query.deleted = {"$regex":req.query.deleted, "$options":"i"};
	}
	else{
		query.deleted = {"$ne": true};
	}
	ProductSpec.find(query,function(err, productSpec){
		res.json({results: productSpec, error: err});
	});
};
module.exports.addProductSpec = function(req,res){//Add New
		var d = new Date();
		var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
		let newProductSpec = new ProductSpec({
			product_id: req.body.product_id,
			specification_field_id: req.body.specification_field_id,
			specification_field_name: req.body.specification_field_name,
			specification_field_value: req.body.specification_field_value,
			deleted: req.body.deleted,
			createdBy: req.payload.user_id,
			createdAt: at,
			changedBy: req.payload.user_id,
			changedAt: at
		});
		
		newProductSpec.save((err, productSpec)=>{
			if(err){
				res.json({statusCode: 'F', msg: 'Failed to add', error: err});
			}
			else{
				res.json({statusCode: 'S', msg: 'Entry added', productSpec: productSpec});
			}
		});
};

module.exports.updateProductSpec = function(req,res){//Update
	var d = new Date();
	var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
	let updateProductSpec = {
		_id:req.body._id,
		product_id: req.body.product_id,
		specification_field_id: req.body.specification_field_id,
		specification_field_name: req.body.specification_field_name,
		specification_field_value: req.body.specification_field_value,
		deleted: req.body.deleted,
		//createdBy: req.body.createdBy,
		//createdAt: req.body.createdAt,
		changedBy: req.payload.user_id,
		changedAt: at
	};
	
	ProductSpec.findOneAndUpdate({_id:req.body._id},{$set: updateProductSpec},{},(err, productSpec)=>{
		if(err){
			res.json({statusCode: 'F', msg: 'Failed to update', error: err});
		}
		else{
			res.json({statusCode: 'S', msg: 'Entry updated', updated: productSpec});
		}
	});
};

module.exports.deleteProductSpec = function(req,res){//Delete
	ProductSpec.remove({_id: req.params.id}, function(err,result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
};
module.exports.addMultiProductSpec = function(req,res){//Add Multiple 
	var records = req.body.docs;
	var results = [];
	for(var i = 0; i<records.length; i++){
		var d = new Date();
		records[i].createdAt = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
		records[i].changedAt = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
	}
	ProductSpec.insertMany(records,(err, productSpec)=>{
			if(err){
				res.json({statusCode: 'F', msg: 'Failed to add', error: err});
			}
			else{
				res.json({statusCode: 'S', msg: 'Entry added', productSpec: productSpec});
			}
		});
		
};


//////////////////////////Product Image Table////////////////////////////////
const PrdImage = mongoose.model('PrdImage');

module.exports.getPrdImage = function(req,res){//Fetch
	var query = {};
	if(req.query.image_id){
		query.image_id = {"$regex":req.query.image_id, "$options":"i"};
	}
	if(req.query.product_id){
		query.product_id = {"$regex":req.query.product_id, "$options":"i"};
	}
	PrdImage.find(query,function(err, prdImage){
		res.json({results: prdImage, error: err});
	});
};
module.exports.addPrdImage = function(req,res){//Add New
	var image_id = "0";
	Counter.getNextSequenceValue('prdImage',function(sequence){
		if(sequence){
			var index_count = sequence.sequence_value;
			var buffr = new Buffer(req.body.data,'base64');
			let newPrdImage = new PrdImage({
				product_id: req.body.product_id,
				data: buffr,
				type: req.body.type,
				name: req.body.name,
				image_id: "PRDIMG_"+(image_id - (-index_count)),
				default: req.body.default
			});
			
			newPrdImage.save((err, prdImage)=>{
				if(err){
					res.json({statusCode: 'F', msg: 'Failed to add', error: err});
				}
				else{
					res.json({statusCode: 'S', msg: 'Entry added', prdImage: prdImage});
				}
			});
		}
		else{
			res.json({statusCode: 'F', msg: 'Unable to generate sequence number.'});
		}
	});
};

module.exports.updatePrdImage = function(req,res){//Update
	var buffr = new Buffer(req.body.data,'base64');
	let updatePrdImage = {
		_id:req.body._id,
		product_id: req.body.product_id,
		data: buffr,
		type: req.body.type,
		name: req.body.name,
		image_id: req.body.image_id,
		default: req.body.default
	};
	
	PrdImage.findOneAndUpdate({_id:req.body._id},{$set: updatePrdImage},{},(err, prdImage)=>{
		if(err){
			res.json({statusCode: 'F', msg: 'Failed to update', error: err});
		}
		else{
			res.json({statusCode: 'S', msg: 'Entry updated', updated: prdImage});
		}
	});
};

module.exports.deletePrdImage = function(req,res){//Delete
	PrdImage.remove({_id: req.params.id}, function(err,result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
};

module.exports.addMultiplePrdImage = function(req,res){//Add Multiple Images
	var PrdThumbnail = mongoose.model('PrdThumbnail');
	var records = req.body.docs;
	var image_id = '0';
	docs.forEach(function(currentItem, index, arr){
		var item = JSON.parse(JSON.stringify(currentItem));
		var buffr = new Buffer(currentItem.data,'base64');
		//var prd_id = ""+ currentItem.product_type_name +"_"+ currentItem.brand_name +"_"+ currentItem.model +"_"+ currentItem.variant;
		Counter.getNextSequenceValue('prdImage',function(sequence){
			if(sequence){
				var index_count = sequence.sequence_value;
				let newPrdImage = new PrdImage({
					product_id: currentItem.product_id,
					data: buffr,
					type: currentItem.type,
					name: currentItem.name,
					image_id: "PRDIMG_"+(image_id - (-index_count)),
					default: currentItem.default
				});
				
				newPrdImage.save((err, prdImage)=>{
					if(err){
						res.json({statusCode: 'F', msg: 'Failed to add', error: err});
					}
					else{
						var base64string = "data:"+currentItem.type+";base64,"+currentItem.data;
						module.exports.resizeBase64Img(base64string, 100, 100,function(newImg){
				  			var compressed = newImg.replace(/^data:image\/[a-z]+;base64,/, "");
						
							var thumbnail_buffr = new Buffer(compressed,'base64');
							let newPrdThumbnail = new PrdThumbnail({
								product_id: currentItem.product_id,
								type: currentItem.type,
								name: currentItem.name,
								color: currentItem.color,
								year_from: parseInt(currentItem.year_from),
								year_to: parseInt(currentItem.year_to),
								thumbnail: thumbnail_buffr,
								image_id: prdImage[0].image_id,
								default: currentItem.default
							});

							newPrdThumbnail.save((err, prdThumbnail)=>{
								res.json({statusCode: 'S', msg: 'Image uploaded', results: prdImage});
							});
						});
					}
				});
			}
			else{
				res.json({statusCode: 'F', msg: 'Unable to generate sequence number.'});
			}
		});
	});
			
};

module.exports.resizeBase64Img = function(base64, width, height, callback) {
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        var context = canvas.getContext("2d");
        var img = new Image();
        img.onload = function() {
                        context.scale(width/img.width,  height/img.height);
                        context.drawImage(img, 0, 0);
                        var dataUrl = canvas.toDataURL(); 
			callback(dataUrl);            
  	};
        img.src = base64;
};



//////////////////////////Product Thumbnail Table////////////////////////////////
const PrdThumbnail = mongoose.model('PrdThumbnail');

module.exports.getPrdThumbnail = function(req,res){//Fetch
	var query = {};
	if(req.query.product_id){
		query.product_id = {"$regex":req.query.product_id, "$options":"i"};
	}
	if(req.query.color){
		query.color = {"$regex":req.query.color, "$options":"i"};
	}
	if(req.query.year_of_reg){
		var year_of_reg = parseInt(req.query.year_of_reg);
		query.year_from = {"$lte":year_of_reg};
		query.year_to = {"$gte":year_of_reg};
	}
	PrdThumbnail.find(query,function(err, prdThumbnail){
		res.json({results: prdThumbnail, error: err});
	});
};
module.exports.addPrdThumbnail = function(req,res){//Add New
		var thumbnail_buffr = new Buffer(req.body.thumbnail,'base64');
		let newPrdThumbnail = new PrdThumbnail({
			product_id: req.body.product_id,
			type: req.body.type,
			name: req.body.name,
			color: req.body.color,
			year_from: parseInt(req.body.year_from),
			year_to: parseInt(req.body.year_to),
			thumbnail: thumbnail_buffr,
			image_id: req.body.image_id,
			default: req.body.default
		});
		
		newPrdThumbnail.save((err, prdThumbnail)=>{
			if(err){
				res.json({statusCode: 'F', msg: 'Failed to add', error: err});
			}
			else{
				res.json({statusCode: 'S', msg: 'Entry added', prdThumbnail: prdThumbnail});
			}
		});
	
};

module.exports.updatePrdThumbnail = function(req,res){//Update
	var thumbnail_buffr = new Buffer(req.body.thumbnail,'base64');
	let updatePrdThumbnail = {
		_id:req.body._id,
		product_id: req.body.product_id,
		type: req.body.type,
		name: req.body.name,
		color: req.body.color,
		year_from: parseInt(req.body.year_from),
		year_to: parseInt(req.body.year_to),
		thumbnail: thumbnail_buffr,
		image_id: req.body.image_id,
		default: req.body.default
	};
	
	PrdThumbnail.findOneAndUpdate({_id:req.body._id},{$set: updatePrdThumbnail},{},(err, prdThumbnail)=>{
		if(err){
			res.json({statusCode: 'F', msg: 'Failed to update', error: err});
		}
		else{
			res.json({statusCode: 'S', msg: 'Entry updated', updated: prdThumbnail});
		}
	});
};

module.exports.deletePrdThumbnail = function(req,res){//Delete
	var PrdImage = mongoose.model('PrdImage');
	PrdThumbnail.remove({_id: req.body._id}, function(err,result){
			if(err){
				res.json({statusCode: 'F', msg: 'Unable to delete the image.', error: err});
			}
			else{
				PrdImage.remove({image_id: req.body.image_id}, function(image_err,image_result){
					if(image_err){
						res.json({statusCode: 'F', msg: 'Unable to remove Image but the thumbnail was removed.', error: image_err});
					}
					else{
						res.json({statusCode: 'S', msg: 'Image deleted successfully.', results: image_result});
					}
				});
			}
		});
	
	
	
	/*PrdThumbnail.remove({_id: req.params.id}, function(err,result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});*/
};
module.exports.getPrdThumbnailColors = function(req,res){//Fetch
	var query = {};
	if(req.query.product_id){
		query.product_id = {"$regex":req.query.product_id, "$options":"i"};
		
		PrdThumbnail.find(query).distinct( "color",function(err, result){
			res.json({statusCode: 'S', msg: 'Successfully retrieved.', results: result, error: err});
		});
	}
	else{
		res.json({statusCode: 'F', msg: 'No Product ID.'});
	}
};


//////////////////////////COUNTRY STATE CITY LOCATION////////////////////////////////
const Loc = mongoose.model('Loc');

module.exports.getLoc = function(req,res){//Fetch
	var query = {};
	if(req.query.country){
		query.country = {"$regex":req.query.country, "$options":"i"};
	}
	if(req.query.state){
		query.state = {"$regex":req.query.state, "$options":"i"};
	}
	if(req.query.city){
		query.city = {"$regex":req.query.city, "$options":"i"};
	}
	if(req.query.location){
		query.location = {"$regex":req.query.location, "$options":"i"};
	}
	if(req.query.deleted){
		query.deleted = {"$regex":req.query.deleted, "$options":"i"};
	}
	else{
		query.deleted = {"$ne": true};
	}
	Loc.find(query,function(err, result){
		res.json({results: result, error: err});
	});
};
module.exports.addLoc = function(req,res){//Add New
	
		var d = new Date();
		var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
		
		var doc = req.body;
		doc.createdAt = at;
		doc.changedAt = at;
		doc.createdBy = req.payload.user_id;
		doc.changedBy = req.payload.user_id;
		
		let newLoc = new Loc(doc);
		
		newLoc.save((err, result)=>{
			if(err){
				res.json({statusCode: 'F', msg: 'Failed to add', error: err});
			}
			else{
				res.json({statusCode: 'S', msg: 'Entry added', result: result});
			}
		});
};
module.exports.updateLoc = function(req,res){//Update
	var d = new Date();
	var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
	var doc = req.body;
		delete doc.createdAt;
		delete doc.createdBy;
		doc.changedAt = at;
		doc.changedBy = req.payload.user_id;
		
	Loc.findOneAndUpdate({_id:doc._id},{$set: doc},{},(err, updated)=>{
		if(err){
			res.json({statusCode: 'F', msg: 'Failed to update', error: err});
		}
		else{
			res.json({statusCode: 'S', msg: 'Entry updated', updated: updated});
		}
	});
};
module.exports.deleteLoc = function(req,res){//Delete
	Loc.remove({_id: req.params.id}, function(err,result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
};

//Fetch Country
module.exports.getCountry = function(req,res){//Fetch
	var query = {};
	query.deleted = {"$ne": true};
	Loc.find(query).distinct( "country",function(err, result){
		var entries = result;
		if(!err){
			entries = [];
			for(var i = 0; i<result.length; i++){
				entries.push({country: result[i]});
			}
		}		
		res.json({results: entries, error: err});
	});
};

//Fetch State
module.exports.getState = function(req,res){//Fetch
	var query = {};
	if(req.query.country){
		query.country = {"$regex":req.query.country, "$options":"i"};
	}
	query.deleted = {"$ne": true};
	Loc.find(query).distinct( "state",function(err, result){
		var entries = result;
		if(!err){
			entries = [];
			for(var i = 0; i<result.length; i++){
				entries.push({state: result[i]});
			}
		}		
		res.json({results: entries, error: err});
	});
};

//Fetch City
module.exports.getCity = function(req,res){//Fetch
	var query = {};
	if(req.query.state){
		query.state = {"$regex":req.query.state, "$options":"i"};
	}
	query.deleted = {"$ne": true};
	Loc.find(query).distinct( "city",function(err, result){
		var entries = result;
		if(!err){
			entries = [];
			for(var i = 0; i<result.length; i++){
				entries.push({city: result[i]});
			}
		}		
		res.json({results: entries, error: err});
	});
};

//Fetch Location
module.exports.getUnqLocation = function(req,res){//Fetch
	var query = {};
	if(req.query.city){
		query.city = {"$regex":req.query.city, "$options":"i"};
	}
	query.deleted = {"$ne": true};
	Loc.find(query).distinct( "location",function(err, result){
		var entries = result;
		if(!err){
			entries = [];
			for(var i = 0; i<result.length; i++){
				entries.push({location: result[i]});
			}
		}		
		res.json({results: entries, error: err});
	});
};




//////////////////////////Configuration Parameter////////////////////////////////
const Parameter = mongoose.model('Parameter');

module.exports.getAllParameter = function(req,res){//Fetch
	Parameter.find({},function(err, result){
			if(err)
				res.json({statusCode: 'F', msg: 'Unable to fetch.', error: err});
			else
				res.json({statusCode: 'S', msg: 'Successfully fetched.', results: result});
	});
};
module.exports.getParameter = function(req,res){//Fetch
	console.log(req);
	if(req.query.parameter){
		var query = {};
		query.parameter = {"$eq":req.query.parameter};
		console.log(query);
		Parameter.find(query,function(err, result){
			console.log(err);
			console.log(result);
			if(err)
				res.json({statusCode: 'F', msg: 'Unable to fetch.', error: err});
			else
				res.json({statusCode: 'S', msg: 'Successfully fetched.', results: result});
		});
	}
	else{
		res.json({statusCode: 'F', msg: 'No parameter to pass.'});
	}
};
module.exports.addParameter = function(req,res){//Add New
	var doc = req.body;			
	let newParameter = new Parameter(doc);			
	newParameter.save((err, result)=>{
		if(err){
			res.json({statusCode: 'F', msg: 'Failed to add', error: err});
		}
		else{
			res.json({statusCode: 'S', msg: 'Entry added', result: result});							
		}
	});
};
module.exports.updateParameter = function(req,res){//Update
	var doc = req.body;		
	Parameter.findOneAndUpdate({_id:doc._id},{$set: doc},{},(err, updated)=>{
		if(err){
			res.json({statusCode: 'F', msg: 'Failed to update', error: err});
		}
		else{
			res.json({statusCode: 'S', msg: 'Entry updated', updated: updated});
		}
	});
};
module.exports.deleteParameter = function(req,res){//Delete
	Parameter.remove({_id: req.params.id}, function(err,result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
};











