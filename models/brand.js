const mongoose = require('mongoose');


var BrandSchema = new mongoose.Schema({
	brand_id:{
		type: String,
		required: true,
		maxLength: 16,
		index: true,
		unique: true
	},
	brand_name:{
		type: String,
		maxLength: 50
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
BrandSchema.index({ brand_id: 1},{unique: true});
mongoose.model('Brand', BrandSchema);
