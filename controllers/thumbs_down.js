
const async = require("async");
const request = require('request');
var mongoose = require('mongoose');
var Counter = mongoose.model('Counter');

//////////////////////////ThumbsDown////////////////////////////////
const ThumbsDown = mongoose.model('ThumbsDown');

module.exports.getThumbsDown = function(req,res){//Fetch
	var query = {};
	if(req.query.thumbs_down_id){
		query.thumbs_down_id = {"$regex":req.query.thumbs_down_id, "$options":"i"};
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
	ThumbsDown.find(query,function(err, result){
		res.json({results: result, error: err});
	});
};
module.exports.addThumbsDown = function(req,res){//Add New
	var thumbs_down_id = "0";
	Counter.getNextSequenceValue('thumbs_down',function(sequence){
		if(sequence){
			var index_count = sequence.sequence_value;
			var d = new Date();
			var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
			
			var doc = req.body;
			doc.thumbs_down_id = thumbs_down_id - (-index_count);
			doc.createdAt = at;
			doc.changedAt = at;
			doc.createdBy = req.payload.user_id;
			doc.changedBy = req.payload.user_id;
			
			let newThumbsDown = new ThumbsDown(doc);
			
			newThumbsDown.save((err, result)=>{
				if(err){
					res.json({statusCode: 'F', msg: 'Failed to add thumbs down', error: err});
				}
				else{
					var Feedback = mongoose.model('Feedback');
					Feedback.find({feedback_id: {"$eq":doc.feedback_id}},function(feedback_find_err, feedback_result){
						if(feedback_find_err){
							res.json({statusCode: 'F', msg: 'Thumbs Down added but Failed to update feedback', results:result, error: feedback_find_err});
						}
						else if(feedback_result.length>0){
							var updateFeedback = JSON.parse(JSON.stringify(feedback_result[0]));
							updateFeedback.thumbs_down_no = (updateFeedback.thumbs_down_no) ? updateFeedback.thumbs_down_no : '0';
							updateFeedback.thumbs_down_no = updateFeedback.thumbs_down_no - (-1);
							Feedback.findOneAndUpdate({_id:updateFeedback._id},{$set: updateFeedback},{},(feedback_update_err, feedback_updated)=>{
								if(feedback_update_err){
									res.json({statusCode: 'F', msg: 'Thumbs Down added but Failed to update feedback', results:result, error: feedback_update_err});
								}
								else{
									res.json({statusCode: 'S', msg: 'Thumbs Down & Feedback Entry updated successfully', results:result, updated: feedback_updated});
								}
							});
						}
						else{
							res.json({statusCode: 'F', msg: 'Thumbs Down added but Failed to update feedback', results:result, error: err});
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
module.exports.updateThumbsDown = function(req,res){//Update
	var d = new Date();
	var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
	var doc = req.body;
		delete doc.createdAt;
		delete doc.createdBy;
		doc.changedAt = at;
		doc.changedBy = req.payload.user_id;
		
	ThumbsDown.findOneAndUpdate({_id:doc._id},{$set: doc},{},(err, updated)=>{
		if(err){
			res.json({statusCode: 'F', msg: 'Failed to update', error: err});
		}
		else{
			res.json({statusCode: 'S', msg: 'Entry updated', updated: updated});
		}
	});
};
module.exports.deleteThumbsDown = function(req,res){//Delete
	ThumbsDown.remove({_id: req.params.id}, function(err,result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
};
