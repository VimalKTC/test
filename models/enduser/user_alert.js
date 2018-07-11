const mongoose = require('mongoose');


var UserAlertSchema = new mongoose.Schema({
	user_id:{
		type: String
	},
	alert_id:{
		type: String,
		required: true,
		index: true,
		unique: true
	},
	bid_sell_buy:{
		type: String 
	},
	individual_dealer:{
		type: String 
	},
	product_type_name:{
		type: String 
	},
	brand_name:{
		type: String 
	},
	model:{
		type: String 
	},
	variant:{
		type: String 
	},
	fuel_type:{
		type: String 
	},
	city:{
		type: String 
	},
	price_from:{
		type: String 
	},
	price_to:{
		type: String 
	},
	km_run_from:{
		type: Number,
		integer: true
	},
	km_run_to:{
		type: Number,
		integer: true
	},
	year_of_reg_from:{
		type: Number,
		integer: true
	},
	year_of_reg_to:{
		type: Number,
		integer: true
	},
	sms:{
		type: Boolean 
	},
	email:{
		type: Boolean 
	},
	app:{
		type: Boolean 
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
UserAlertSchema.index({ alert_id: 1},{unique: true});
mongoose.model('UserAlert', UserAlertSchema);