const mongoose = require('mongoose');


var FilterSchema = new mongoose.Schema({
	user_id:{
		type: String
	},
	filter_field:{
		type: String 
	},
	filter_value:{
		type: String
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

mongoose.model('Filter', FilterSchema);