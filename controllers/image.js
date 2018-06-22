
const async = require("async");
const request = require('request');
var mongoose = require('mongoose');
var random = require('random-number');

//////////////////////////Transaction Image Table////////////////////////////////
const Image = mongoose.model('Image');
const Thumbnail = mongoose.model('Thumbnail');

module.exports.getImage = function(req,res){//Fetch
	var query = {};
	if(req.query.image_id){
		query.image_id = {"$eq":req.query.image_id};
		Image.find(query,function(err, image){
			res.json({results: image, error: err});
		});
	}
	else if(req.query.transaction_id){
		query.transaction_id = {"$regex":req.query.transaction_id, "$options":"i"};
		Thumbnail.find({transaction_id: {"$eq":req.query.transaction_id}, default: {"$eq": true}},function(thumbnail_err, thumbnail){
			if(thumbnail && thumbnail.length>0){
				Image.find({image_id: {"$eq": thumbnail[0].image_id}},function(err, image){
					res.json({results: image, error: err});
				});
			}
			else{
				Image.find(query,function(err, image){
					res.json({results: image, error: err});
				});
			}
		});
	}
	else
		res.json({results: null, error: {}});
	
};
module.exports.addImage = function(req,res){//Add New
	var image_id = "IMG_";
	
	var options = {
	  min: 10000000, max: 99999999, integer: true
	};
	var randomNumber = random(options);
	image_id = image_id + randomNumber + "_" + req.body.transaction_id;
	
	
	//var uniqueIndex = 1;

	//Image.find().sort({uniqueIndex:-1}).limit(1)
	//	.exec(function(err, maxValue) 
	//{	console.log(maxValue);
	//	if(maxValue.length && maxValue.length > 0){
	//		uniqueIndex = 1 - (- maxValue[0].uniqueIndex);
	//		image_id = "IMG_" + uniqueIndex;
	//	}
		
	//	console.log(image_id);
		var buffr = new Buffer(req.body.data,'base64');
		let newImage = new Image({
			user_id: req.body.user_id,
			transaction_id: req.body.transaction_id,
			data: buffr,
			type: req.body.type,
			name: req.body.name,
			image_id: image_id,
			//uniqueIndex: uniqueIndex,
			default: req.body.default
		});
		
		newImage.save((err, image)=>{
			if(err){
				if(err.error.code === 11000) {
					module.exports.addImage(req,res);
				}
				else
					res.json({statusCode: 'F', msg: 'Failed to add', error: err});
			}
			else{
				res.json({statusCode: 'S', msg: 'Entry added', image: image});
			}
		});
	//});
};

module.exports.updateImage = function(req,res){//Update
	var buffr = new Buffer(req.body.data,'base64');
	let updateImage = {
		_id:req.body._id,
		user_id:req.body.user_id,
		transaction_id: req.body.transaction_id,
		data: buffr,
		type: req.body.type,
		name: req.body.name,
		image_id: req.body.image_id,
		//uniqueIndex: req.body.uniqueIndex,
		default: req.body.default
	};
	
	Image.findOneAndUpdate({_id:req.body._id},{$set: updateImage},{},(err, image)=>{
		if(err){
			res.json({statusCode: 'F', msg: 'Failed to update', error: err});
		}
		else{
			res.json({statusCode: 'S', msg: 'Entry updated', updated: image});
		}
	});
};

module.exports.deleteImage = function(req,res){//Delete
	Image.remove({_id: req.params.id}, function(err,result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
};

