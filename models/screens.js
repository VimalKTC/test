const mongoose = require('mongoose');


var ScreenSchema = new mongoose.Schema({	
	screen:{
		type: String,
		required: true,
		maxLength: 30
	}
});

mongoose.model('Screen', ScreenSchema);