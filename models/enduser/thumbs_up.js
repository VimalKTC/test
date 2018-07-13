const mongoose = require('mongoose');


var ThumbsUpSchema = new mongoose.Schema({
	service_id:{
		type: String
	},
	thumbs_up_id:{
		type: String,
		required: true,
		index: true,
		unique: true
	},
	active:{
		type: Boolean
	},
	deleted:{
		type: Boolean 
	},
	createdBy:{
		type: String 
	},
	createdAt:{
		type: String 
	},
	changedBy:{
		type: String 
	},
	changedAt:{
		type: String 
	}
});

ThumbsUpSchema.index({ thumbs_up_id: 1},{unique: true});
mongoose.model('ThumbsUp', ThumbsUpSchema);
