const mongoose = require('mongoose');


var CounterSchema = new mongoose.Schema({
	  collection_id: {
		  type: String,
		  required: true,
		  index: true,
		  unique: true
	  },
	  sequence_value: {
		  type: Number,
		  default: 0
	  }
});
CounterSchema.statics.getNextSequenceValue = function(sequenceName,callback){
	//var Counter = mongoose.model('Counter');	
	var sequenceDocument = this.collection.findAndModify(
		{collection_id: sequenceName },
		[],
		{$inc:{sequence_value:1}},
		{upsert: true, new: true},
	function(err,res){
		if(err)
			callback(null)
		else
			callback(res.value);
	});
		
	//return sequenceDocument.sequence_value;
};

CounterSchema.index({ collection_id: 1},{unique: true});
mongoose.model('Counter', CounterSchema);