
const async = require("async");
const request = require('request');
var mongoose = require('mongoose');

//////////////////////////User Subscription Mapping Table////////////////////////////////
const UserSubMap = mongoose.model('UserSubMap');

module.exports.getUserSubMap = function(req,res){//Fetch
	var query = {};
	if(req.query.subscription_id){
		query.subscription_id = {"$regex":req.query.subscription_id, "$options":"i"};
	}
	if(req.query.user_id){
		query.user_id = {"$regex":req.query.user_id, "$options":"i"};
	}
	if(req.query.deleted){
		query.deleted = {"$regex":req.query.deleted, "$options":"i"};
	}
	else{
		query.deleted = {"$ne": true};
	}
	UserSubMap.find(query,function(err, result){
		res.json({results: result, error: err});
	});
};
module.exports.addUserSubMap = function(req,res){//Add New
	var tdyObj = new Date();
	var valid_from = tdyObj.getDate() +"/"+ (tdyObj.getMonth() - (-1)) +"/"+ tdyObj.getFullYear() ;
	var validity_unit = req.body.validity_unit.toLowerCase();
	if(validity_unit.includes("hour")){
		var d = new Date();
		d.setTime(d.getTime() + (parseInt(req.body.validity_period)*60*60*1000)); 
		valid_to = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
	}
	else if(validity_unit.includes("day")){
		var d = new Date();
		d.setDate(d.getDate() + parseInt(req.body.validity_period));
		valid_to = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
	}
	else if(validity_unit.includes("month")){
		var d = new Date();
		d.setMonth(d.getMonth() + parseInt(req.body.validity_period));
		valid_to = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
	}
	else if(validity_unit.includes("year")){
		var d = new Date();
		d.setFullYear(d.getFullYear() + parseInt(req.body.validity_period));
		valid_to = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
	}
	var Subscription = mongoose.model('Subscription');
	var query = {"subscription_id":{"$regex":req.body.subscription_id, "$options":"i"}};
	
	Subscription.find(query,function(err, result){
		if(err){
			res.json({statusCode: 'F', msg: 'Failed to add', error: err});
		}else if(result.length && result.length > 0){
			var d = new Date();
			var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
			let newSubscription = new UserSubMap({
				user_id: req.body.user_id,
				subscription_id: req.body.subscription_id,
				subscription_name: req.body.subscription_name,
				app_id: req.body.app_id,
				app_name: req.body.app_name,
				role_id: result[0].role_id,
				valid_from: valid_from, 
				valid_to: valid_to,
				amt_paid: req.body.amt_paid,
				currency: req.body.currency,
				remain_post: result[0].post_allowed,
				post_day: result[0].post_day,
				post_priority: result[0].post_priority,
				feature: result[0].featureOnTop,
				getHighlighted: result[0].getHighlighted,
				notification_sms: result[0].notification_sms,
				notification_email: result[0].notification_email,
				notification_app: result[0].notification_app,
				active: "X",
				createdBy: req.body.createdBy,
				createdAt: at,
				changedBy: req.body.changedBy,
				changedAt: at,
				deleted: req.body.deleted
			});
			
			UserSubMap.updateMany({"user_id": {$eq: req.body.user_id}},{$set: {"active": "-"}},{upsert: false},(update_err, update_result)=>{
				if(update_err){
					res.json({statusCode: 'F', msg: 'Failed to add', error: update_err});
				}
				else{
					newSubscription.save((save_err, save_result)=>{
						if(save_err){
							res.json({statusCode: 'F', msg: 'Failed to add', error: save_err});
						}
						else{
							res.json({statusCode: 'S', msg: 'Entry added', results: save_result});
						}
					});
				}
			});
				
		}
		else{
			res.json({statusCode: 'F', msg: 'Invalid Subscription. Failed to add', error: ""});
		}
	});
};
module.exports.updateUserSubMap = function(req,res){//Update
	var d = new Date();
	var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
	let updateSubscription = {
			_id:req.body._id,
			user_id: req.body.user_id,
			subscription_id: req.body.subscription_id,
			subscription_name: req.body.subscription_name,
			app_id: req.body.app_id,
			app_name: req.body.app_name,
			role_id: req.body.role_id,
			valid_from: req.body.valid_from,
			valid_to: req.body.valid_to,
			amt_paid: req.body.amt_paid,
			currency: req.body.currency,
			remain_post: req.body.remain_post,
			post_day: req.body.post_day,
			post_priority: req.body.post_priority,
			feature: req.body.feature,
			getHighlighted: req.body.getHighlighted,
			notification_sms: req.body.notification_sms,
			notification_email: req.body.notification_email,
			notification_app: req.body.notification_app,
			active: req.body.active,
			//createdBy: req.body.createdBy,
			//createdAt: req.body.createdAt,
			changedBy: req.body.changedBy,
			changedAt: at,
			deleted: req.body.deleted
	};
	
	UserSubMap.findOneAndUpdate({_id:req.body._id},{$set: updateSubscription},{},(err, result)=>{
		if(err){
			res.json({statusCode: 'F', msg: 'Failed to update', error: err});
		}
		else{
			res.json({statusCode: 'S', msg: 'Entry updated', updated: result});
		}
	});
};

module.exports.deleteUserSubMap = function(req,res){//Delete
	UserSubMap.remove({_id: req.params.id}, function(err,result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
};

