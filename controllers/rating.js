
const async = require("async");
const request = require('request');
var mongoose = require('mongoose');
var Counter = mongoose.model('Counter');

//////////////////////////Rating////////////////////////////////
const Rating = mongoose.model('Rating');

module.exports.getRating = function(req,res){//Fetch
	var query = {};
	if(req.query.rating_id){
		query.rating_id = {"$regex":req.query.rating_id, "$options":"i"};
	}
	if(req.query.service_id){
		query.service_id = {"$regex":req.query.service_id, "$options":"i"};
	}
	if(req.query.deleted){
		query.deleted = {"$regex":req.query.deleted, "$options":"i"};
	}
	else{
		query.deleted = {"$ne": true};
	}
	Rating.find(query,function(err, result){
		res.json({results: result, error: err});
	});
};
module.exports.addRating = function(req,res){//Add New
	var rating_id = "0";
	Counter.getNextSequenceValue('rating',function(sequence){
		if(sequence){
			var index_count = sequence.sequence_value;
			var d = new Date();
			var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
			
			var doc = req.body;
			doc.rating_id = rating_id - (-index_count);
			doc.createdAt = at;
			doc.changedAt = at;
			doc.createdBy = req.payload.user_id;
			doc.changedBy = req.payload.user_id;
			
			let newRating = new Rating(doc);
			
			newRating.save((err, result)=>{
				if(err){
					res.json({statusCode: 'F', msg: 'Failed to add rating', error: err});
				}
				else{
					var Service = mongoose.model('Service');
					Service.find({service_id: {"$eq":doc.service_id}},function(service_find_err, service_result){
						if(service_find_err){
							res.json({statusCode: 'F', msg: 'Rating Entry added but Service update failed', result: result, error:service_find_err});
						}
						else if(service_result.length>0){
							var updateService = JSON.parse(JSON.stringify(service_result[0]));
							updateService.no_of_one_star = (updateService.no_of_one_star)?updateService.no_of_one_star:'0';
							updateService.no_of_two_star = (updateService.no_of_two_star)?updateService.no_of_two_star:'0';
							updateService.no_of_three_star = (updateService.no_of_three_star)?updateService.no_of_three_star:'0';
							updateService.no_of_four_star = (updateService.no_of_four_star)?updateService.no_of_four_star:'0';
							updateService.no_of_five_star = (updateService.no_of_five_star)?updateService.no_of_five_star:'0';
							if(doc.rating === '1'){							
								updateService.no_of_one_star = updateService.no_of_one_star - (-1);
							}
							if(doc.rating === '2'){							
								updateService.no_of_two_star = updateService.no_of_two_star - (-1);
							}
							if(doc.rating === '3'){							
								updateService.no_of_three_star = updateService.no_of_three_star - (-1);
							}
							if(doc.rating === '4'){							
								updateService.no_of_four_star = updateService.no_of_four_star - (-1);
							}
							if(doc.rating === '5'){							
								updateService.no_of_five_star = updateService.no_of_five_star - (-1);
							}
							updateService.no_of_rating = (updateService.no_of_rating)?updateService.no_of_rating:'0';
							updateService.no_of_rating = updateService.no_of_rating - (-1);
							
							updateService.rating = (((1 * updateService.no_of_one_star)
														+ (2 * updateService.no_of_two_star)
															+ (3 * updateService.no_of_three_star)
																+ (4 * updateService.no_of_four_star)
																	+ (5 * updateService.no_of_five_star)) / (updateService.no_of_rating)).toFixed(1);
							
							Service.findOneAndUpdate({_id:updateService._id},{$set: updateService},{},(service_update_err, service_updated)=>{
								if(service_update_err){
									res.json({statusCode: 'F', msg: 'Rating updated but Failed to update service', result: result, error: service_update_err});
								}
								else{
									res.json({statusCode: 'S', msg: 'Rating and Service Entry updated Successfully.', result: result, updated: service_updated});
								}
							});
						}
						else{
							res.json({statusCode: 'F', msg: 'Rating Entry added but Service update failed', result: result, error:err});
						}
					});			
					
				}
			});
		}
		else{
			res.json({statusCode: 'F', msg: 'Unable to generate sequence number.'});
		}
	});
};
module.exports.updateRating = function(req,res){//Update
	var d = new Date();
	var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
	var doc = req.body;
		delete doc.createdAt;
		delete doc.createdBy;
		doc.changedAt = at;
		doc.changedBy = req.payload.user_id;
		
	Rating.findOneAndUpdate({_id:doc._id},{$set: doc},{},(err, updated)=>{
		if(err){
			res.json({statusCode: 'F', msg: 'Failed to update', error: err});
		}
		else{
			res.json({statusCode: 'S', msg: 'Entry updated', updated: updated});
		}
	});
};
module.exports.deleteRating = function(req,res){//Delete
	Rating.remove({_id: req.params.id}, function(err,result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
};
