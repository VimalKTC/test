var mongoose = require('mongoose');


var ProfileSchema = new mongoose.Schema({
	user_id:{
		type: String,
		required: true,
		index: true,
		unique: true
	},
	admin:{
		type: String,
		//required: true
	},
	mobile:{
		type: String,
		required: true
	},
	name:{
		type: String
	},
	gender:{
		type: String
	},
	email:{
		type: String
	},
	currency:{
		type: String
	},
	walletAmount:{
		type: String
	},
	mobile_verified:{
		type: String
	},
	email_verified:{
		type: String
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
ProfileSchema.index({ user_id: 1},{unique: true});
//const Profile = 
mongoose.model('Profile', ProfileSchema);
