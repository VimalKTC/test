const mongoose = require('mongoose');


var SubscriptionSchema = new mongoose.Schema({
	subscription_id:{
		type: String,
		required: true,
		maxLength: 16,
		index: true,
		unique: true
	},
	subscription_name:{
		type: String,
		maxLength: 50
	},
	app_name:{
		type: String,
		maxLength: 16
	},
	role_id:{
		type: String
	},
	validity_unit:{
		type: String,
		maxLength: 6
	},
	validity_period:{
		type: String
	},
	amount:{
		type: String
	},
	currency:{
		type: String 
	},
	post_allowed:{
		type: String
	},
	post_day:{
		type: String
	},
	post_priority:{
		type: String
	},
	featureOnTop:{
		type: String
	},
	getHighlighted:{
		type: String
	},	
	notification_sms:{
		type: String,
		maxLength: 1
	},
	notification_email:{
		type: String,
		maxLength: 1
	},
	notification_app:{
		type: String,
		maxLength: 1
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
	},
	deleted:{
		type: Boolean
	}
});
SubscriptionSchema.index({ subscription_id: 1},{unique: true});
mongoose.model('Subscription', SubscriptionSchema);