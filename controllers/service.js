
const async = require("async");
const request = require('request');
var mongoose = require('mongoose');
var ctrlNotification = require('./notification');
const UserSubMap = mongoose.model('UserSubMap');

//////////////////////////Service////////////////////////////////
const Service = mongoose.model('Service');

module.exports.getService = function(req,res){//Fetch
	var query = {};
	if(req.query.service_id){
		query.service_id = {"$regex":req.query.service_id, "$options":"i"};
	}
	if(req.query.user_id){
		query.user_id = {"$regex":req.query.user_id, "$options":"i"};
	}
	if(req.query.city){
		query.city = {"$regex":req.query.city, "$options":"i"};
	}
	if(req.query.deleted){
		query.deleted = {"$regex":req.query.deleted, "$options":"i"};
	}
	else{
		query.deleted = {"$ne": true};
	}
	query.active = {"$eq": "X"};
	Service.find(query,function(err, result){
		res.json({results: result, error: err});
	});
};
module.exports.addService = function(req,res){//Add New
	var query_sub = {}
	query_sub.user_id = {"$eq":req.payload.user_id};
	query_sub.active = {"$eq": "X"};
	query_sub.deleted = {"$ne": true};
	UserSubMap.find(query_sub,function(err_sub, result_sub){
		if(result_sub.length>0){
			var to = (result_sub[0].valid_to).split('/');
			var toDateObj = new Date(to[2]+'-'+to[1]+'-'+to[0]);
			var currentDateObj = new Date();
			if(toDateObj>currentDateObj && parseInt(result_sub[0].remain_post) > 0){
					var service_id = "1";
					var command = Service.find().sort({"service_id":-1}).limit(1);
					command.exec(function(err, maxValue) 
					{	
						if(maxValue.length && maxValue.length > 0){
							service_id = "SERVICE_"+(service_id - (- (maxValue[0].service_id).substr(8)));
						}
						else{
							service_id = "SERVICE_1";
						}
						var d = new Date();
						var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
						
						var doc = req.body;
						doc.service_id = service_id;
						doc.createdAt = at;
						doc.changedAt = at;
						doc.active = "X";
						
						if(doc.start_from_amount && !isNaN(doc.start_from_amount)){
							if(parseFloat(doc.start_from_amount) >= 10000000){//Crore
								var amt = (parseFloat(doc.start_from_amount)/10000000).toFixed(2);
								doc.display_amount = amt + "Cr";
							}
							else if(parseFloat(doc.start_from_amount) >= 100000){//Lakhs
								var amt = (parseFloat(doc.start_from_amount)/100000).toFixed(2);
								doc.display_amount = amt + "L";
							}
							else{//Thousands
								var amt = (parseFloat(doc.start_from_amount)/1000).toFixed(2);
								doc.display_amount = amt + "K";
							}
						}
						
						let newService = new Service(doc);
						
						newService.save((err, result)=>{
							if(err){
								res.json({statusCode: 'F', msg: 'Failed to add', error: err});
							}
							else{
								res.json({statusCode: 'S', msg: 'Entry added', result: result});
								//Deduct Post Remains
								var d = new Date();
								var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
								var updateSubscription = result_sub[0];
								updateSubscription.changedAt = at;
								updateSubscription.remain_post = result_sub[0].remain_post - 1;							
								UserSubMap.findOneAndUpdate({_id: result_sub[0]._id},{$set: updateSubscription},{},(err_subUpdate, result_subUpdate)=>{
									
								});
								
								//Trigger Notification
								var entry = doc; entry.transactionType = "Service";
								ctrlNotification.sendNotification(entry);
							}
						});
					});	
			}
			else{
				res.json({statusCode: 'F', msg: 'Either Subscription is expired or no Post is left in your account.'});
			}
		}
		else{
			res.json({statusCode: 'F', msg: 'Subscription unavailable.', error: err_sub});
		}
	});
};
module.exports.updateService = function(req,res){//Update
	var d = new Date();
	var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
	var doc = req.body;
		delete doc.createdAt;
		delete doc.createdBy;
		doc.changedAt = at;
		
	if(doc.start_from_amount && !isNaN(doc.start_from_amount)){
							if(parseFloat(doc.start_from_amount) >= 10000000){//Crore
								var amt = (parseFloat(doc.start_from_amount)/10000000).toFixed(2);
								doc.display_amount = amt + "Cr";
							}
							else if(parseFloat(doc.start_from_amount) >= 100000){//Lakhs
								var amt = (parseFloat(doc.start_from_amount)/100000).toFixed(2);
								doc.display_amount = amt + "L";
							}
							else{//Thousands
								var amt = (parseFloat(doc.start_from_amount)/1000).toFixed(2);
								doc.display_amount = amt + "K";
							}
	}
		
	Service.findOneAndUpdate({_id:doc._id},{$set: doc},{},(err, updated)=>{
		if(err){
			res.json({statusCode: 'F', msg: 'Failed to update', error: err});
		}
		else{
			res.json({statusCode: 'S', msg: 'Entry updated', updated: updated});
		}
	});
};
module.exports.deleteService = function(req,res){//Delete
	Service.remove({_id: req.params.id}, function(err,result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
};
