const mongoose = require('mongoose');


var ImageSchema = new mongoose.Schema({
	user_id:{
		type: String
	},
	transaction_id:{
		type: String,
		required: true,
		unique: false,
		index: true
	},
	image_id:{
		type: String,
		required: true,
		unique: true,
		index: true
	},
	data:{
		type: Buffer
	},
	type:{
		type: String
	},
	name:{
		type: String
	},
	default: {
		type: Boolean
	}
});
ImageSchema.index({ image_id: 1},{unique: true});
mongoose.model('Image', ImageSchema);