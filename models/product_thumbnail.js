const mongoose = require('mongoose');


var PrdThumbnailSchema = new mongoose.Schema({
	product_id:{
		type: String
	},
	type:{
		type: String
	},
	name:{
		type: String
	},
	color:{
		type: String
	},
	year_from:{
		type: Number
	},
	year_to:{
		type: Number
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

mongoose.model('PrdThumbnail', PrdThumbnailSchema);
