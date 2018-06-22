const mongoose = require('mongoose');


var RoleSchema = new mongoose.Schema({
	role_id:{
		type: String,
		required: true,
		index: true,
		unique: true
	},
	role_name:{
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
RoleSchema.index({ role_id: 1},{unique: true});
mongoose.model('Role', RoleSchema);