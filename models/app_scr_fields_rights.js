const mongoose = require('mongoose');


var AppScrFieldsRightsSchema = new mongoose.Schema({
	subscription_id:{
		type: String
	},
	role_id:{
		type: String,
		required: true
	},
	app_id:{
		type: String,
		required: true,
		maxLength: 16
	},
	screen:{
		type: String,
		maxLength: 30
	},
	screen_for_nav:{
		type: Boolean
	},
	screen_sequence:{
		type: String
	},
	applicable: {
		type: Boolean
	},
	field:{
		type: String,
		maxLength: 30
	},
	field_type:{
		type: String
	},
	field_path:{
		type: String
	},
	field_source:{
		type: String
	},
	field_required:{
		type: Boolean
	},
	field_category:{
		type: String
	},
	field_sequence:{
		type: String
	},
	field_from_config:{
		type: Boolean
	},
	field_for_filter:{
		type: Boolean
	},
	create:{
		type: Boolean
	},
	edit:{
		type: Boolean
	},
	delete:{
		type: Boolean
	},
	visible:{
		type: Boolean
	},
	editable:{
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
	},
	deleted:{
		type: Boolean
	}
});

mongoose.model('AppScrFieldsRights', AppScrFieldsRightsSchema);