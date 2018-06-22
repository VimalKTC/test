const mongoose = require('mongoose');


var ThumbnailSchema = new mongoose.Schema({
	user_id:{
		type: String
	},
	transaction_id:{
		type: String,
		required: true
	},
	type:{
		type: String
	},
	name:{
		type: String
	},
	thumbnail:{
		type: Buffer
	},
	image_id: {
		type: String
	},
	default: {
		type: Boolean
	}
})

mongoose.model('Thumbnail', ThumbnailSchema);
