const mongoose = require('mongoose');


var ServiceSchema = new mongoose.Schema({
	user_id:{
		type: String
	},
	index_count:{
		type: Number,
		required: true
	},
	service_id:{
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
	default_image_path:{
		type: String 
	},
	number_of_image:{
		type: String 
	},
	catalog:{
		type: String 
	},
	start_from_amount:{
		type: String 
	},
	display_amount:{
		type: String
	},
	rating:{
		type: String 
	},
	no_of_rating:{
		type: String 
	},
	no_of_feedback:{
		type: String 
	},
	no_of_one_star:{
		type: String 
	},
	no_of_two_star:{
		type: String 
	},
	no_of_three_star:{
		type: String 
	},
	no_of_four_star:{
		type: String 
	},
	no_of_five_star:{
		type: String 
	},
	name:{
		type: String 
	},
	mobile:{
		type: String 
	},
	address_id:{
		type: String 
	},
	city:{
		type: String 
	},
	location:{
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

ServiceSchema.index({ index_count:1, service_id: 1},{unique: true});
mongoose.model('Service', ServiceSchema);