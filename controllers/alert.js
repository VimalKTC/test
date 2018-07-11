
const async = require("async");
const request = require('request');
var mongoose = require('mongoose');
var Counter = mongoose.model('Counter');

//////////////////////////User Alerts////////////////////////////////
const UserAlert = mongoose.model('UserAlert');

module.exports.getUserAlert = function(req,res){//Fetch
	var query = {};
	if(req.query.alert_id){
		query.alert_id = {"$regex":req.query.alert_id, "$options":"i"};
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
	UserAlert.find(query,function(err, result){
		res.json({results: result, error: err});
	});
};
module.exports.addUserAlert = function(req,res){//Add New
	var alert_id = "0";
	Counter.getNextSequenceValue('alert',function(sequence){
		if(sequence){
			var index_count = sequence.sequence_value;
			var d = new Date();
			var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
			let newUserAlert = new UserAlert({
				user_id: req.body.user_id,
				alert_id: alert_id - (-index_count),
				bid_sell_buy: req.body.bid_sell_buy,
				individual_dealer: req.body.individual_dealer,
				product_type_name: req.body.product_type_name,
				brand_name: req.body.brand_name,
				model: req.body.model,
				variant: req.body.variant,
				fuel_type: req.body.fuel_type,
				city: req.body.city,
				price_from: req.body.price_from,
				price_to: req.body.price_to,
				km_run_from: req.body.km_run_from,
				km_run_to: req.body.km_run_to,
				year_of_reg_from: req.body.year_of_reg_from,
				year_of_reg_to: req.body.year_of_reg_to,
				sms: req.body.sms,
				email: req.body.email,
				app: req.body.app,
				active: req.body.active,
				deleted: req.body.deleted,
				createdBy: req.payload.user_id,
				createdAt: at,
				changedBy: req.payload.user_id,
				changedAt: at
			});
			
			newUserAlert.save((err, result)=>{
				if(err){
					res.json({statusCode: 'F', msg: 'Failed to add', error: err});
				}
				else{
					res.json({statusCode: 'S', msg: 'Entry added', result: result});
				}
			});
		}
		else{
			res.json({statusCode: 'F', msg: 'Unable to generate sequence number.'});
		}
	});
};
module.exports.updateUserAlert = function(req,res){//Update
	var d = new Date();
	var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
	let updateUserAddress = {
			_id:req.body._id,
			user_id: req.body.user_id,
			alert_id: req.body.alert_id,
			bid_sell_buy: req.body.bid_sell_buy,
			individual_dealer: req.body.individual_dealer,
			product_type_name: req.body.product_type_name,
			brand_name: req.body.brand_name,
			model: req.body.model,
			variant: req.body.variant,
			fuel_type: req.body.fuel_type,
			city: req.body.city,
			price_from: req.body.price_from,
			price_to: req.body.price_to,
			km_run_from: req.body.km_run_from,
			km_run_to: req.body.km_run_to,
			year_of_reg_from: req.body.year_of_reg_from,
			year_of_reg_to: req.body.year_of_reg_to,
			sms: req.body.sms,
			email: req.body.email,
			app: req.body.app,
			active: req.body.active,
			deleted: req.body.deleted,
			//createdBy: req.body.createdBy,
			//createdAt: req.body.createdAt,
			changedBy: req.payload.user_id,
			changedAt: at
	};
	
	UserAlert.findOneAndUpdate({_id:req.body._id},{$set: updateUserAddress},{},(err, updated)=>{
		if(err){
			res.json({statusCode: 'F', msg: 'Failed to update', error: err});
		}
		else{
			res.json({statusCode: 'S', msg: 'Entry updated', updated: updated});
		}
	});
};

module.exports.deleteUserAlert = function(req,res){//Delete
	UserAlert.remove({_id: req.params.id}, function(err,result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
};
