const mongoose = require('mongoose');


var PrdImageSchema = new mongoose.Schema({
	product_id:{
		type: String
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
	image_id:{
		type: String,
		required: true,
		unique: true,
		index: true
	},
	default: {
		type: Boolean
	}
})
PrdImageSchema.index({ image_id: 1},{unique: true});
mongoose.model('PrdImage', PrdImageSchema);
