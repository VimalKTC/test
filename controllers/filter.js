
const async = require("async");
const request = require('request');
var mongoose = require('mongoose');

//////////////////////////FILTER////////////////////////////////
const Filter = mongoose.model('Filter');

module.exports.getFilter = function(req,res){//Fetch
	var query = {};

	if(req.query.user_id){
		query.user_id = {"$regex":req.query.user_id, "$options":"i"};
	}
	if(req.query.deleted){
		query.deleted = {"$regex":req.query.deleted, "$options":"i"};
	}
	else{
		query.deleted = {"$ne": true};
	}
	Filter.find(query,function(err, result){
		res.json({results: result, error: err});
	});
};
module.exports.addFilter = function(req,res){//Add New
	Filter.remove( {user_id: {$eq: req.body.user_id}} , function(err_delete,result_delete){
		if(err_delete){
			res.json({statusCode: 'F', msg: 'Unable to remove previous filters.', error: err_delete});
		}
		else{
				var d = new Date();
				var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
				
				var docs = req.body.data;
				for(var i = 0; i<docs.length; i++){
					docs[i].createdAt = at;
					docs[i].changedAt = at;
					docs[i].createdBy = req.payload.user_id;
					docs[i].changedBy = req.payload.user_id;
				}
				
				Filter.insertMany(docs,(err, result)=>{
					if(err){
						res.json({statusCode: 'F', msg: 'Failed to save your filter settings.', error: err});
					}
					else{
						res.json({statusCode: 'S', msg: 'Settings saved', results: result});
					}
				});
		}
	});		
};


module.exports.updateFilter = function(req,res){//Update
	var d = new Date();
	var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
	var doc = req.body;
		delete doc.createdAt;
		delete doc.createdBy;
		doc.changedAt = at;
		doc.createdBy = req.payload.user_id
		doc.changedBy = req.payload.user_id;
		
	Filter.findOneAndUpdate({_id:doc._id},{$set: doc},{},(err, updated)=>{
		if(err){
			res.json({statusCode: 'F', msg: 'Failed to update', error: err});
		}
		else{
			res.json({statusCode: 'S', msg: 'Entry updated', updated: updated});
		}
	});
};

module.exports.deleteFilter = function(req,res){//Delete
	Filter.remove({_id: req.params.id}, function(err,result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
};


module.exports.deleteMultipleFilter = function(req,res){//Delete Multiple
	Filter.remove( {user_id: {$eq: req.body.user_id}} , function(err,result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
};
