const mongoose = require('mongoose');


var LocSchema = new mongoose.Schema({
	country:{
		type: String
	},
	city:{
		type: String
	},
	state:{
		type: String
	},
	location:{
		type: String
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

mongoose.model('Loc', LocSchema);