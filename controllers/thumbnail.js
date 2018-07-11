
const async = require("async");
const request = require('request');
var mongoose = require('mongoose');

//////////////////////////Transaction Thumbnail Table////////////////////////////////
const Thumbnail = mongoose.model('Thumbnail');
const Image = mongoose.model('Image');

module.exports.getThumbnail = function(req,res){//Fetch
	var query = {};
	if(req.query.user_id){
		query.user_id = {"$regex":req.query.user_id, "$options":"i"};
	}
	if(req.query.transaction_id){
		query.transaction_id = {"$regex":req.query.transaction_id, "$options":"i"};
	}
	Thumbnail.find(query,function(err, thumbnail){
		res.json({results: thumbnail, error: err});
	});
};
module.exports.addThumbnail = function(req,res){//Add New
		var thumbnail_buffr = new Buffer(req.body.thumbnail,'base64');
		let newThumbnail = new Thumbnail({
			user_id: req.body.user_id,
			transaction_id: req.body.transaction_id,
			type: req.body.type,
			name: req.body.name,
			thumbnail: thumbnail_buffr,
			image_id: req.body.image_id,
			default: req.body.default
		});
		
		newThumbnail.save((err, thumbnail)=>{
			if(err){
				res.json({statusCode: 'F', msg: 'Failed to add', error: err});
			}
			else{
				res.json({statusCode: 'S', msg: 'Entry added', thumbnail: thumbnail});
			}
		});
	
};
module.exports.updateThumbnail = function(req,res){//Update
	if(req.body.markForDelete){//Remove if marked for deletion
		Thumbnail.remove({_id: req.body._id}, function(err,result){
			if(err){
				res.json({statusCode: 'F', msg: 'Unable to delete the image.', error: err});
			}
			else{
				Image.remove({image_id: req.body.image_id}, function(image_err,image_result){
					if(image_err){
						res.json({statusCode: 'F', msg: 'Unable to remove Image but the thumbnail was removed.', error: image_err});
					}
					else{
						res.json({statusCode: 'S', msg: 'Image deleted successfully.', results: image_result});
					}
				});
			}
		});
	}
	else{
		var thumbnail_buffr = new Buffer(req.body.thumbnail,'base64');
		let updateThumbnail = {
			_id:req.body._id,
			user_id:req.body.user_id,
			transaction_id: req.body.transaction_id,
			type: req.body.type,
			name: req.body.name,
			thumbnail: thumbnail_buffr,
			image_id: req.body.image_id,
			default: req.body.default
		};
		
		Thumbnail.findOneAndUpdate({_id:req.body._id},{$set: updateThumbnail},{},(err, thumbnail)=>{
			if(err){
				res.json({statusCode: 'F', msg: 'Failed to update', error: err});
			}
			else{
				res.json({statusCode: 'S', msg: 'Entry updated', updated: thumbnail});
			}
		});	
	}
};

module.exports.deleteThumbnail = function(req,res){//Delete
	Thumbnail.remove({_id: req.params.id}, function(err,result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
};

