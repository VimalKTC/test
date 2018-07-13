const mongoose = require('mongoose');


var ProductSchema = new mongoose.Schema({
	product_id:{
		type: String,
		required: true,
		maxLength: 16,
		index: true,
		unique: true
	},
	product_type_id:{
		type: String,
		maxLength: 16
	},
	product_type_name:{
		type: String,
		maxLength: 50
	},
	brand_id:{
		type: String,
		maxLength: 16
	},
	brand_name:{
		type: String,
		maxLength: 50
	},
	model:{
		type: String
	},
	variant:{
		type: String
	},
	image_path:{
		type: String,
		maxLength: 200
	},
	deleted:{
		type: Boolean,
		required: true
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
ProductSchema.index({ product_id: 1},{unique: true});
mongoose.model('Product', ProductSchema);
