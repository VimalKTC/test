
const async = require("async");
const request = require('request');
var mongoose = require('mongoose');
var ctrlNotification = require('./notification');
const UserSubMap = mongoose.model('UserSubMap');
const Counter = mongoose.model('Counter');

//////////////////////////Service////////////////////////////////
const Service = mongoose.model('Service');

module.exports.getService = function(req,res){//Fetch
	var query = {};
	if(req.query.service_id){
		query.service_id = {"$regex":req.query.service_id, "$options":"i"};
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
	
	if(req.query.user_id){
		query.user_id = {"$regex":req.query.user_id, "$options":"i"};
		
		Service.count(query,function(err_count,res_count){
			var count = res_count;
			if(req.query.count && !isNaN(req.query.count))
				count = parseInt(req.query.count);
			
			var skip = (req.query.skip && !isNaN(req.query.skip))?req.query.skip:0;
			if(count && res_count>count && req.query.skip)
				skip = (res_count - count) - (- req.query.skip);
			
			var limit = (req.query.limit && !isNaN(req.query.limit))?req.query.limit:10;
						
			Service.find(query).sort({"index_count":-1}).skip(parseInt(skip)).limit(parseInt(limit))
			.exec(function(err, result){
				if(err){
					res.json({results: null, error: err, params:{count:count, skip:skip, limit:limit}});
				}
				else{
					res.json({results: result, error: err, params:{count:count, skip:skip-(-result.length), limit:limit}});
				}
			});
		});
	}
	else{
		Service.find(query,function(err, result){
			res.json({results: result, error: err, params:{}});
		});
	}
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
					//var service_id = "1";
					Counter.getNextSequenceValue('service',function(sequence){
					if(sequence){
						var index_count = sequence.sequence_value;//1;
					/*var command = Service.find().sort({"service_id":-1}).limit(1);
					command.exec(function(err, maxValue) 
					{	
						if(maxValue.length && maxValue.length > 0){
							service_id = "SERVICE_"+(service_id - (- (maxValue[0].service_id).substr(8)));
							index_count = (service_id - (- (maxValue[0].service_id).substr(8)));
						}
						else{
							service_id = "SERVICE_1";
						}*/
						var d = new Date();
						var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
						
						var doc = req.body;
						doc.index_count = index_count;
						doc.service_id = "SERVICE_"+index_count;//service_id;
						doc.createdAt = at;
						doc.changedAt = at;
						doc.createdBy = req.payload.user_id;
						doc.changedBy = req.payload.user_id;
						doc.active = "X";
						
						//For testing purpose (to be removed)
						if(doc.testing)
							doc.variant = index_count;
						
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
								//var updateSubscription = result_sub[0];
								//updateSubscription.changedAt = at;
								//updateSubscription.remain_post = result_sub[0].remain_post - 1;							
								UserSubMap.findOneAndUpdate({_id: result_sub[0]._id},{$set:{changedAt: at}, $inc:{remain_post: -1}},{},(err_subUpdate, result_subUpdate)=>{
									
								});
								
								//Trigger Notification
								var entry = doc; entry.transactionType = "Service";
								ctrlNotification.sendNotification(entry);
							}
						});
					//});
					}
					else{
						res.json({statusCode: 'F', msg: 'Unable to generate sequence number.'});
					}
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
		doc.changedBy = req.payload.user_id;
		
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
