const mongoose = require('mongoose');


var BidBySchema = new mongoose.Schema({
	bid_by_user_id:{
		type: String,
		required: true
	},
	bid_by_name:{
		type: String,
		required: true
	},
	bid_id:{
		type: String,
		required: true
	},
	bid_amount:{
		type: String 
	},
	bid_hike_by:{
		type: String 
	},
	current_bid_amount:{
		type: String 
	},
	bid_date_time:{
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

mongoose.model('BidBy', BidBySchema);