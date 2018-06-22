
const async = require("async");
const request = require('request');
var mongoose = require('mongoose');
var ctrlNotification = require('./notification');
const UserSubMap = mongoose.model('UserSubMap');

//////////////////////////Buy////////////////////////////////
const Buy = mongoose.model('Buy');

module.exports.getBuy = function(req,res){//Fetch
	var query = {};
	if(req.query.buy_req_id){
		query.buy_req_id = {"$regex":req.query.buy_req_id, "$options":"i"};
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
	Buy.find(query,function(err, result){
		res.json({results: result, error: err});
	});
};
module.exports.addBuy = function(req,res){//Add New
	var query_sub = {}
	query_sub.user_id = {"$eq":req.payload.user_id};
	query_sub.active = {"$eq": "X"};
	query_sub.deleted = {"$ne": true};
	UserSubMap.find(query_sub,function(err_sub, result_sub){
		if(result_sub.length>0){
			/*var valid_sub = []
			for(var count=0; count<result_sub.length; count++){
				var to = (result_sub[count].valid_to).split('/');
				var toDateObj = new Date(to[2]+'-'+to[1]+'-'+to[0]);
				var currentDateObj = new Date();
				if(toDateObj>currentDateObj && result_sub[count].remain_post > '0'){
					valid_sub.push(result_sub[count]);
				}
			}			
			if(valid_sub.length === 0){
				res.json({statusCode: 'F', msg: 'Either Subscription is expired or no Post is left in your account.'});
			}*/
			
			var to = (result_sub[0].valid_to).split('/');
			var toDateObj = new Date(to[2]+'-'+to[1]+'-'+to[0]);
			var currentDateObj = new Date();
			if(toDateObj>currentDateObj && parseInt(result_sub[0].remain_post) > 0){
				var buy_req_id = "1";
				var command = Buy.find().sort({"buy_req_id":-1}).limit(1);
				command.exec(function(err, maxValue) 
				{	
					if(maxValue.length && maxValue.length > 0){
						buy_req_id = "BUYREQ_"+(buy_req_id - (- (maxValue[0].buy_req_id).substr(7)));
					}
					else{
						buy_req_id = "BUYREQ_1";
					}
					var d = new Date();
					var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
					
					var doc = req.body;
					doc.buy_req_id = buy_req_id;
					doc.createdAt = at;
					doc.changedAt = at;
					doc.active = "X";
					
					if(doc.net_price && !isNaN(doc.net_price)){
						if(parseFloat(doc.net_price) >= 10000000){//Crore
							var amt = (parseFloat(doc.net_price)/10000000).toFixed(2);
							doc.display_amount = amt + "Cr";
						}
						else if(parseFloat(doc.net_price) >= 100000){//Lakhs
							var amt = (parseFloat(doc.net_price)/100000).toFixed(2);
							doc.display_amount = amt + "L";
						}
						else{//Thousands
							var amt = (parseFloat(doc.net_price)/1000).toFixed(2);
							doc.display_amount = amt + "K";
						}
					}
					
					let newBuy = new Buy(doc);
					
					newBuy.save((err, result)=>{
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
							var entry = doc; entry.transactionType = "Buy";
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
module.exports.updateBuy = function(req,res){//Update
	var d = new Date();
	var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
	var doc = req.body;
		delete doc.createdAt;
		delete doc.createdBy;
		doc.changedAt = at;
		
	if(doc.net_price && !isNaN(doc.net_price)){
						if(parseFloat(doc.net_price) >= 10000000){//Crore
							var amt = (parseFloat(doc.net_price)/10000000).toFixed(2);
							doc.display_amount = amt + "Cr";
						}
						else if(parseFloat(doc.net_price) >= 100000){//Lakhs
							var amt = (parseFloat(doc.net_price)/100000).toFixed(2);
							doc.display_amount = amt + "L";
						}
						else{//Thousands
							var amt = (parseFloat(doc.net_price)/1000).toFixed(2);
							doc.display_amount = amt + "K";
						}
	}
		
	Buy.findOneAndUpdate({_id:doc._id},{$set: doc},{},(err, updated)=>{
		if(err){
			res.json({statusCode: 'F', msg: 'Failed to update', error: err});
		}
		else{
			res.json({statusCode: 'S', msg: 'Entry updated', updated: updated});
		}
	});
};

module.exports.deleteBuy = function(req,res){//Delete
	Buy.remove({_id: req.params.id}, function(err,result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
};