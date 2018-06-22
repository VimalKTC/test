const mongoose = require('mongoose');


var FieldSchema = new mongoose.Schema({
	field:{
		type: String,
		required: true,
		maxLength: 30
	},
	type:{
		type: String
	},
	path:{
		type: String
	},
	source:{
		type: String
	},
	required:{
		type: Boolean
	},
	category:{
		type: String
	},
	sequence:{
		type: String
	},
	for_filter:{
		type: Boolean
	},
	from_config:{
		type: Boolean
	}
});

mongoose.model('Field', FieldSchema);