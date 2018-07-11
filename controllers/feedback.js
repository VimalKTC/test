
const async = require("async");
const request = require('request');
var mongoose = require('mongoose');
var Counter = mongoose.model('Counter');

//////////////////////////Feedback////////////////////////////////
const Feedback = mongoose.model('Feedback');

module.exports.getFeedback = function(req,res){//Fetch
	var query = {};
	if(req.query.feedback_id){
		query.feedback_id = {"$regex":req.query.feedback_id, "$options":"i"};
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
	Feedback.find(query,function(err, result){
		res.json({results: result, error: err});
	});
};
module.exports.addFeedback = function(req,res){//Add New
	var feedback_id = "0";
	Counter.getNextSequenceValue('feedback',function(sequence){
		if(sequence){
			var index_count = sequence.sequence_value;
			var d = new Date();
			var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
			
			var doc = req.body;
			doc.feedback_id = feedback_id - (-index_count);
			doc.createdAt = at;
			doc.changedAt = at;
			doc.createdBy = req.payload.user_id;
			doc.changedBy = req.payload.user_id;
			
			let newFeedback = new Feedback(doc);
			
			newFeedback.save((err, result)=>{
				if(err){
					res.json({statusCode: 'F', msg: 'Failed to add', error: err});
				}
				else{
					var Service = mongoose.model('Service');
					Service.find({service_id: {"$eq":doc.service_id}},function(service_find_err, service_result){
						if(service_find_err){
							res.json({statusCode: 'F', msg: 'Feedback Entry added but Service update failed', result: result, error:service_find_err});
						}
						else if(service_result.length>0){
							var updateService = JSON.parse(JSON.stringify(service_result[0]));
							updateService.no_of_feedback = (updateService.no_of_feedback)?updateService.no_of_feedback:'0';
							updateService.no_of_feedback = updateService.no_of_feedback - (-1);
							Service.findOneAndUpdate({_id:updateService._id},{$set: updateService},{},(service_update_err, service_updated)=>{
								if(service_update_err){
									res.json({statusCode: 'F', msg: 'Feedback updated but Failed to update service', result: result, error: service_update_err});
								}
								else{
									res.json({statusCode: 'S', msg: 'Feedback and Service Entry updated Successfully.', result: result, updated: service_updated});
								}
							});
						}
						else{
							res.json({statusCode: 'F', msg: 'Feedback Entry added but Service update failed', result: result, error:err});
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
module.exports.updateFeedback = function(req,res){//Update
	var d = new Date();
	var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
	var doc = req.body;
		delete doc.createdAt;
		delete doc.createdBy;
		doc.changedAt = at;
		doc.changedBy = req.payload.user_id;
		
	Feedback.findOneAndUpdate({_id:doc._id},{$set: doc},{},(err, updated)=>{
		if(err){
			res.json({statusCode: 'F', msg: 'Failed to update', error: err});
		}
		else{
			res.json({statusCode: 'S', msg: 'Entry updated', updated: updated});
		}
	});
};
module.exports.deleteFeedback = function(req,res){//Delete
	Feedback.remove({_id: req.params.id}, function(err,result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
};
