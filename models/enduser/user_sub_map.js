const mongoose = require('mongoose');


var UserSubMapSchema = new mongoose.Schema({
	user_id:{
		type: String,
		required: true 
	},
	subscription_id:{
		type: String,
		required: true 
	},
	subscription_name:{
		type: String 
	},
	app_id:{
		type: String 
	},
	app_name:{
		type: String 
	},
	role_id:{
		type: String
	},
	valid_from:{
		type: String 
	},
	valid_to:{
		type: String 
	},
	amt_paid:{
		type: String 
	},
	currency:{
		type: String 
	},
	remain_post:{
		type: Number,
		integer: true
	},
	post_day:{
		type: Number,
		integer: true		
	},
	post_priority:{
		type: String
	},
	feature:{
		type: String 
	},
	getHighlighted:{
		type: String,
		maxlength: 1 
	},
	notification_sms:{
		type: String,
		maxlength: 1 
	},
	notification_email:{
		type: String,
		maxlength: 1
	},
	notification_app:{
		type: String,
		maxlength: 1
	},
	active:{
		type: String,
		maxlength: 1
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

mongoose.model('UserSubMap', UserSubMapSchema);