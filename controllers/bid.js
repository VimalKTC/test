
const async = require("async");
const request = require('request');
var mongoose = require('mongoose');
var ctrlNotification = require('./notification');
const UserSubMap = mongoose.model('UserSubMap');

//////////////////////////Bid////////////////////////////////
const Bid = mongoose.model('Bid');

module.exports.getBid = function(req,res){//Fetch
	var query = {};
	if(req.query.bid_id){
		query.bid_id = {"$regex":req.query.bid_id, "$options":"i"};
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
	Bid.find(query,function(err, result){
		res.json({results: result, error: err});
	});
};
module.exports.addBid = function(req,res){//Add New
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
				var bid_id = "1";
				var command = Bid.find().sort({"bid_id":-1}).limit(1);
				command.exec(function(err, maxValue) 
				{	
					if(maxValue.length && maxValue.length > 0){
						bid_id = "BID_"+(bid_id - (- (maxValue[0].bid_id).substr(4)));
					}
					else{
						bid_id = "BID_1";
					}
					var d = new Date();
					var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
					
					var doc = req.body;
					doc.bid_id = bid_id;
					doc.bid_valid_from = at;
					doc.createdAt = at;
					doc.changedAt = at;
					doc.active = "X";
					
					if(doc.current_bid_amount && !isNaN(doc.current_bid_amount)){
						if(parseFloat(doc.current_bid_amount) >= 10000000){//Crore
							var amt = (parseFloat(doc.current_bid_amount)/10000000).toFixed(2);
							doc.display_amount = amt + "Cr";
						}
						else if(parseFloat(doc.current_bid_amount) >= 100000){//Lakhs
							var amt = (parseFloat(doc.current_bid_amount)/100000).toFixed(2);
							doc.display_amount = amt + "L";
						}
						else{//Thousands
							var amt = (parseFloat(doc.current_bid_amount)/1000).toFixed(2);
							doc.display_amount = amt + "K";
						}
					}
					
					/*var UserSubMap = mongoose.model('UserSubMap');
					var query = {};
					query.user_id = {"$eq":req.payload.user_id};
					query.deleted = {"$ne": true};	
					UserSubMap.find(query,function(err_sub, result_sub){*/
						var postLife = 0;
						for(var i = 0; i<result_sub.length; i++){
							if(postLife < parseInt(result_sub[i].post_day)){
								postLife = parseInt(result_sub[i].post_day);
							}
						}
						var d = new Date();
						d.setDate(d.getDate() - (- postLife));
						doc.bid_valid_to = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear();
						let newBid = new Bid(doc);
						
						newBid.save((err, result)=>{
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
								var entry = doc; entry.transactionType = "Bid";
								ctrlNotification.sendNotification(entry);
							}
						});
							
					//});
					
					
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
module.exports.updateBid = function(req,res){//Update
	var d = new Date();
	var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
	var doc = req.body;
		delete doc.createdAt;
		delete doc.createdBy;
		doc.changedAt = at;
		
	if(doc.current_bid_amount && !isNaN(doc.current_bid_amount)){
						if(parseFloat(doc.current_bid_amount) >= 10000000){//Crore
							var amt = (parseFloat(doc.current_bid_amount)/10000000).toFixed(2);
							doc.display_amount = amt + "Cr";
						}
						else if(parseFloat(doc.current_bid_amount) >= 100000){//Lakhs
							var amt = (parseFloat(doc.current_bid_amount)/100000).toFixed(2);
							doc.display_amount = amt + "L";
						}
						else{//Thousands
							var amt = (parseFloat(doc.current_bid_amount)/1000).toFixed(2);
							doc.display_amount = amt + "K";
						}
	}
		
	Bid.findOneAndUpdate({_id:doc._id},{$set: doc},{},(err, updated)=>{
		if(err){
			res.json({statusCode: 'F', msg: 'Failed to update', error: err});
		}
		else{
			res.json({statusCode: 'S', msg: 'Entry updated', updated: updated});
		}
	});
};

module.exports.deleteBid = function(req,res){//Delete
	Bid.remove({_id: req.params.id}, function(err,result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
};
