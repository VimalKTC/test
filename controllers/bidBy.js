
const async = require("async");
const request = require('request');
var mongoose = require('mongoose');
var Profile = mongoose.model('Profile');

//////////////////////////Bid By////////////////////////////////
const BidBy = mongoose.model('BidBy');

module.exports.getBidBy = function(req,res){//Fetch
	var query = {};
	if(req.query.bid_id){
		query.bid_id = {"$regex":req.query.bid_id, "$options":"i"};
	}
	if(req.query.bid_by_user_id){
		query.bid_by_user_id = {"$regex":req.query.bid_by_user_id, "$options":"i"};
	}
	if(req.query.deleted){
		query.deleted = {"$regex":req.query.deleted, "$options":"i"};
	}
	else{
		query.deleted = {"$ne": true};
	}
	BidBy.find(query,function(err, result){
		res.json({results: result, error: err});
	});
};
module.exports.addBidBy = function(req,res){//Add New
	// If no user ID exists in the JWT return a 401
	if (!req.payload.user_id) {
		res.status(401).json({
			"statusCode": 'F',
			"msg" : "Unauthorized Access."
		});
	} else {		
		var Bid = mongoose.model('Bid');
		var query_bid = {};
		query_bid.bid_id = {"$eq":req.body.bid_id};
		query_bid.deleted = {"$ne": true};		
		Bid.find(query_bid,function(err_bid, result_bid){
			if(result_bid.length > 0){
				var to = (result_bid[0].bid_valid_to).split('/');
				var toDateObj = new Date(to[2]+'-'+to[1]+'-'+to[0]);
				var currentDateObj = new Date();
				if(toDateObj>currentDateObj && result_bid[0].active === 'X'){	
					var query = {};
					query.user_id = {"$eq":req.payload.user_id};
					Profile.find(query,function(profile_err, users){
						if(users.length > 0){
							var d = new Date();
							var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
							
							var doc = req.body;
							doc.bid_by_user_id = req.payload.user_id;
							doc.bid_by_name = users[0].name;
							doc.bid_date_time = at +" "+ d.toTimeString();
							doc.createdAt = at;
							doc.changedAt = at;
							doc.createdBy = req.payload.user_id;
							doc.changedBy = req.payload.user_id;
							
							let newBid = new BidBy(doc);
							
							newBid.save((err, result)=>{
								if(err){
									res.json({statusCode: 'F', msg: 'Failed to add', error: err});
								}
								else{
									res.json({statusCode: 'S', msg: 'Entry added', result: result});
								}
							});
						}
						else{
							res.json({statusCode: 'F', msg: 'Failed to add', error: profile_err});
						}
					});
				}
				else{
					res.json({statusCode: 'F', msg: 'The Bid has either Expired or Closed'});
				}
			}
			else{
				res.json({statusCode: 'F', msg: 'Bid details unavailable', error: err_bid});
			}
		});
				
	}
};
module.exports.updateBidBy = function(req,res){//Update
	var d = new Date();
	var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
	var doc = req.body;
		delete doc.createdAt;
		delete doc.createdBy;
		doc.changedAt = at;
		doc.changedBy = req.payload.user_id;
		
	BidBy.findOneAndUpdate({_id:doc._id},{$set: doc},{},(err, updated)=>{
		if(err){
			res.json({statusCode: 'F', msg: 'Failed to update', error: err});
		}
		else{
			res.json({statusCode: 'S', msg: 'Entry updated', updated: updated});
		}
	});
};

module.exports.deleteBidBy = function(req,res){//Delete
	BidBy.remove({_id: req.params.id}, function(err,result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
};
