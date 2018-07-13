const mongoose = require('mongoose');


var FeedbackSchema = new mongoose.Schema({
	service_id:{
		type: String
	},
	feedback_id:{
		type: String,
		required: true,
		index: true,
		unique: true
	},
	subject:{
		type: String
	},
	details:{
		type: String
	},
	user_rating:{
		type: String
	},
	user_id:{
		type: String
	},
	user_name:{
		type: String
	},
	thumbs_up_no:{
		type: String
	},
	thumbs_down_no:{
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

FeedbackSchema.index({ feedback_id: 1},{unique: true});
mongoose.model('Feedback', FeedbackSchema);
