const mongoose = require('mongoose');


var OtpSchema = new mongoose.Schema({
	mobile:{
		type: String,
		required: true,
		index: true,
		unique: true
	},
	otp:{
		type: String
	},
	time: {
		type: Date
	}
});

OtpSchema.index({ mobile: 1},{unique: true});
mongoose.model('Otp', OtpSchema);