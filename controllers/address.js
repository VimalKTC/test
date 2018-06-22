//const express = require('express');
//const router = express.Router();
const async = require("async");
const request = require('request');
var mongoose = require('mongoose');

//////////////////////////User Address////////////////////////////////
const UserAddress = mongoose.model('UserAddress');

module.exports.getUserAddress = function(req,res){//Fetch
	var query = {};
	if(req.query.user_id){
		query.user_id = {"$regex":req.query.user_id, "$options":"i"};
	}
	if(req.query.address_id){
		query.address_id = {"$regex":req.query.address_id, "$options":"i"};
	}
	if(req.query.deleted){
		query.deleted = {"$regex":req.query.deleted, "$options":"i"};
	}
	else{
		query.deleted = {"$ne": true};
	}
	UserAddress.find(query,function(err, userAddress){
		res.json({results: userAddress, error: err});
	});
};
module.exports.addUserAddress = function(req,res){//Add New
	var address_id = "1";
	var command = UserAddress.find().sort({"address_id":-1}).limit(1);
	command.exec(function(err, maxValue) 
	{	
		if(maxValue.length && maxValue.length > 0){
			address_id = "ADD_"+(address_id - (- (maxValue[0].address_id).substr(4)));
		}
		else{
			address_id = "ADD_1";
		}
		var d = new Date();
		var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
		let newUserAddress = new UserAddress({
			user_id: req.body.user_id,
			address_id: address_id,
			address: req.body.address,
			pin_code: req.body.pin_code,
			country: req.body.country,
			state: req.body.state,
			city: req.body.city,
			locality: req.body.locality,
			map_point: req.body.map_point,
			default_flag: req.body.default_flag,
			deleted: req.body.deleted,
			createdBy: req.body.createdBy,
			createdAt: at,
			changedBy: req.body.changedBy,
			changedAt: at
		});
		
		newUserAddress.save((err, address)=>{
			if(err){
				res.json({statusCode: 'F', msg: 'Failed to add', error: err});
			}
			else{
				res.json({statusCode: 'S', msg: 'Entry added', address: address});
			}
		});
	});
};
module.exports.updateUserAddress = function(req,res){//Update
	var d = new Date();
	var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
	let updateUserAddress = {
			_id:req.body._id,
			user_id: req.body.user_id,
			address_id: req.body.address_id,
			address: req.body.address,
			pin_code: req.body.pin_code,
			country: req.body.country,
			state: req.body.state,
			city: req.body.city,
			locality: req.body.locality,
			map_point: req.body.map_point,
			default_flag: req.body.default_flag,
			deleted: req.body.deleted,
			//createdBy: req.body.createdBy,
			//createdAt: req.body.createdAt,
			changedBy: req.body.changedBy,
			changedAt: at
	};
	
	UserAddress.findOneAndUpdate({_id:req.body._id},{$set: updateUserAddress},{},(err, updated)=>{
		if(err){
			res.json({statusCode: 'F', msg: 'Failed to update', error: err});
		}
		else{
			res.json({statusCode: 'S', msg: 'Entry updated', updated: updated});
		}
	});
};

module.exports.deleteUserAddress = function(req,res){//Delete
	UserAddress.remove({_id: req.params.id}, function(err,result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
};
