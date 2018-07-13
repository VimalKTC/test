const mongoose = require('mongoose');


var PrdTypSpecFieldMapSchema = new mongoose.Schema({
	product_type_id:{
		type: String,
		maxLength: 16
	},
	product_type_name:{
		type: String,
		maxLength: 50
	},
	specification_field_id:{
		type: String,
		maxLength: 16
	},
	specification_field_name:{
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

mongoose.model('PrdTypSpecFieldMap', PrdTypSpecFieldMapSchema);
