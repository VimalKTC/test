const mongoose = require('mongoose');


var ApplicationSchema = new mongoose.Schema({
	app_id:{
		type: String,
		required: true,
		index: true,
		unique: true
	},
	app_name:{
		type: String,
		//required: true
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
ApplicationSchema.index({ app_id: 1},{unique: true});
mongoose.model('Application', ApplicationSchema);