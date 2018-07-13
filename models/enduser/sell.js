const mongoose = require('mongoose');


var SellSchema = new mongoose.Schema({
	user_id:{
		type: String
	},
	index_count:{
		type: Number,
		required: true
	},
	sell_id:{
		type: String,
		required: true
	},
	product_id:{
		type: String 
	},
	product_type_id:{
		type: String 
	},
	product_type_name:{
		type: String 
	},
	brand_id:{
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
	default_image_path:{
		type: String 
	},
	color:{
		type: String 
	},
	number_of_image:{
		type: String 
	},
	fuel_type:{
		type: String 
	},
	body_type:{
		type: String 
	},
	transmission:{
		type: String 
	},
	owner_type:{
		type: String 
	},
	listing_by:{
		type: String 
	},
	verified_feature:{
		type: String 
	},
	insurance:{
		type: String 
	},
	accessories:{
		type: String 
	},
	reg_state:{
		type: String 
	},
	address_id:{
		type: String 
	},
	country:{
		type: String 
	},
	state:{
		type: String 
	},
	city:{
		type: String 
	},
	location:{
		type: String 
	},
	year_of_reg:{
		type: String 
	},
	km_done:{
		type: String 
	},
	list_price:{
		type: String 
	},
	discount:{
		type: String 
	},
	tax:{
		type: String
	},
	delivery:{
		type: String
	},
	others:{
		type: String
	},
	net_price:{
		type: String
	},
	display_amount:{
		type: String
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
SellSchema.index({ index_count:1, sell_id: 1},{unique: true});
mongoose.model('Sell', SellSchema);