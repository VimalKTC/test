const mongoose = require('mongoose');


var SpecFieldsSchema = new mongoose.Schema({
	specification_field_id:{
		type: String,
		required: true,
		maxLength: 16,
		index: true,
		unique: true
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
SpecFieldsSchema.index({ specification_field_id: 1},{unique: true});
mongoose.model('SpecField', SpecFieldsSchema);
