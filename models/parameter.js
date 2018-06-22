const mongoose = require('mongoose');


var ParameterSchema = new mongoose.Schema({
	parameter:{
		type: String
	},
	value:{
		type: String
	}
});

mongoose.model('Parameter', ParameterSchema);