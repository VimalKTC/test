const mongoose = require('mongoose');


var ProductTypSchema = new mongoose.Schema({
	product_type_id:{
		type: String,
		required: true,
		maxLength: 16,
		index: true,
		unique: true
	},
	product_type_name:{
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
ProductTypSchema.index({ product_type_id: 1},{unique: true});
mongoose.model('ProductTyp', ProductTypSchema);
