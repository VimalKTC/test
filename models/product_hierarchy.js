const mongoose = require('mongoose');


var ProductHierarchySchema = new mongoose.Schema({
	parent_product_hierarchy_id:{
		type: String,
		maxLength: 16
	},
	product_hierarchy_id:{
		type: String,
		required: true,
		maxLength: 16,
		index: true,
		unique: true
	},
	product_type_id:{
		type: String,
		required: true,
		maxLength: 16
	},
	product_type_name:{
		type: String,
		maxLength: 50
	},
	child_product_hierarchy_id:{
		type: String,
		maxLength: 16
	},
	deleted:{
		type: Boolean,
		required: true
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
ProductHierarchySchema.index({ product_hierarchy_id: 1},{unique: true});
mongoose.model('ProductHierarchy', ProductHierarchySchema);
