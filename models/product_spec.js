const mongoose = require('mongoose');


var ProductSpecSchema = new mongoose.Schema({
	product_id:{
		type: String,
		maxLength: 16
	},
	specification_field_id:{
		type: String,
		maxLength: 16
	},
	specification_field_name:{
		type: String,
		maxLength: 50
	},
	specification_field_value:{
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

mongoose.model('ProductSpec', ProductSpecSchema);
