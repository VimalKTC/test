const mongoose = require('mongoose');


var UserAddressSchema = new mongoose.Schema({
	user_id:{
		type: String,
		required: true
	},
	address_id:{
		type: String,
		required: true,
		index: true,
		unique: true
	},
	name:{
		type: String
	},
	mobile:{
		type: String
	},
	address:{
		type: String
	},
	pin_code:{
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
	locality:{
		type: String
	},
	map_point:{
		type: String
	},
	default_flag:{
		type: Boolean
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
UserAddressSchema.index({ address_id: 1},{unique: true});
mongoose.model('UserAddress', UserAddressSchema);