
const async = require("async");
const request = require('request');
var mongoose = require('mongoose');

//////////////////////////Search////////////////////////////////
const Sell = mongoose.model('Sell');
const Buy = mongoose.model('Buy');
const Bid = mongoose.model('Bid');
const Service = mongoose.model('Service');

const Filter = mongoose.model('Filter');
const Loc = mongoose.model('Loc');

module.exports.search = function(req,res){//Fetch
	 //Check token validity
     if(req.payload.exp < (Date.now() / 1000)){                            
        res.status(440).json({
          "message" : "Session expired.",
          "url" : "/"
        });
     }

	// If no user ID exists in the JWT return a 401
    if (!req.payload.user_id) {
        res.status(401).json({
           "message" : "Unauthorized access."
        });
    }else {
       //var query = {};//{ $or: [{ tags: { $in: [ /^be/, /^st/ ] } }]};
	   if(req.query.term){
		   var term = (req.query.term).split(" ");
		   var terms = [];
		   for(var i = 0; i < term.length; i++){
				terms.push(new RegExp(term[i], 'i'));
		   }
		   var ands = [
							{deleted: {$ne: true}},
							{active: {$eq: "X"}},
							{ $or:
								  [
								   {product_type_name:  { $in: terms }},
								   {brand_name:  { $in: terms }},
								   {model:  { $in: terms }},
								   {variant:  { $in: terms }}
								  ]
							}
						];
						
			if(req.query.city){ ands.push({city: {$eq: req.query.city}}); }
			if(req.query.location){ ands.push({location: {$eq: req.query.location}}); }
			
			var query_filter = {};
			query_filter.user_id = {"$eq":req.payload.user_id};
			query_filter.deleted = {"$ne": true};			
			Filter.find(query_filter,function(err_filter, result_filter){
						var user_filter = {};
						for(var i=0; i<result_filter.length; i++){
							if(result_filter[i].filter_value && result_filter[i].filter_field){//If Filter Value & Field is there
								var terms = [];
								if(user_filter[result_filter[i].filter_field]){//If filter field already defined
									terms = user_filter[result_filter[i].filter_field]['$in'];
									terms.push(result_filter[i].filter_value);
									user_filter[result_filter[i].filter_field] = {'$in': terms};
								}
								else{
									terms = [];
									terms.push(result_filter[i].filter_value);
									user_filter[result_filter[i].filter_field] = {'$in': terms};								
								}
								
							}
							
						}
						ands.push(user_filter);
						var query = {$and: ands};
															  
						var type = req.query.type;
						var results = [];
						if(type === "Sale"){
							Sell.find(query).limit(6)
								.exec(function(err, result) {
									for(var i=0; i<result.length; i++){
										var clone = JSON.parse(JSON.stringify(result[i]));
										clone.text = result[i].product_type_name +" "+ result[i].brand_name +" "+ result[i].model +" "+ result[i].variant ;
										clone.type = "Sale";
										
										var exist = false;
										for(var j=0; j<results.length; j++){
											if(clone.text === results[j].text){
												exist = true; break;
											}
										}
										if(!exist)
											results.push(clone);
									}
									res.status(200).json({results: results, error: err});
							});
						}
						else if(type === "Buy"){
							Buy.find(query).limit(6)
								.exec(function(err, result) {
									for(var i=0; i<result.length; i++){
										var clone = JSON.parse(JSON.stringify(result[i]));
										clone.text = result[i].product_type_name +" "+ result[i].brand_name +" "+ result[i].model +" "+ result[i].variant ;
										clone.type = "Buy";
										
										var exist = false;
										for(var j=0; j<results.length; j++){
											if(clone.text === results[j].text){
												exist = true; break;
											}
										}
										if(!exist)
											results.push(clone);
									}
									res.status(200).json({results: results, error: err});
							});
						}
						else if (type === "Bid"){
							Bid.find(query).limit(6)
								.exec(function(err, result) {
									for(var i=0; i<result.length; i++){
										var clone = JSON.parse(JSON.stringify(result[i]));
										clone.text = result[i].product_type_name +" "+ result[i].brand_name +" "+ result[i].model +" "+ result[i].variant ;
										clone.type = "Bid";
										
										var exist = false;
										for(var j=0; j<results.length; j++){
											if(clone.text === results[j].text){
												exist = true; break;
											}
										}
										if(!exist)
											results.push(clone);
									}
									res.status(200).json({results: results, error: err});
							});
						}
						else if(type === "Service"){
							Service.find(query).limit(6)
								.exec(function(err, result) {
									for(var i=0; i<result.length; i++){
										var clone = JSON.parse(JSON.stringify(result[i]));
										clone.text = result[i].product_type_name +" "+ result[i].brand_name +" "+ result[i].model +" "+ result[i].variant ;
										clone.type = "Service";
										
										var exist = false;
										for(var j=0; j<results.length; j++){
											if(clone.text === results[j].text){
												exist = true; break;
											}
										}
										if(!exist)
											results.push(clone);
									}
									res.status(200).json({results: results, error: err});
							});
						}
						else{			
							Sell.find(query).limit(2)
								.exec(function(err, sales) {
									for(var i=0; i<sales.length; i++){
										var clone = JSON.parse(JSON.stringify(sales[i]));
										clone.text = sales[i].product_type_name +" "+ sales[i].brand_name +" "+ sales[i].model +" "+ sales[i].variant ;
										clone.type = "Sale";
										
										var exist = false;
										for(var j=0; j<results.length; j++){
											if(clone.text === results[j].text){
												exist = true; break;
											}
										}
										if(!exist)
											results.push(clone);
									}
									//res.status(200).json({results: result, error: err});
									Buy.find(query).limit(2)
										.exec(function(err, buy) {
											for(var i=0; i<buy.length; i++){
												var clone = JSON.parse(JSON.stringify(buy[i]));
												clone.text = buy[i].product_type_name +" "+ buy[i].brand_name +" "+ buy[i].model +" "+ buy[i].variant ;
												clone.type = "Buy";
												
												var exist = false;
												for(var j=0; j<results.length; j++){
													if(clone.text === results[j].text){
														exist = true; break;
													}
												}
												if(!exist)
													results.push(clone);
											}
											//res.status(200).json({results: result, error: err});
											Bid.find(query).limit(2)
												.exec(function(err, bids) {
													for(var i=0; i<bids.length; i++){
														var clone = JSON.parse(JSON.stringify(bids[i]));
														clone.text = bids[i].product_type_name +" "+ bids[i].brand_name +" "+ bids[i].model +" "+ bids[i].variant ;
														clone.type = "Bid";
														
														var exist = false;
														for(var j=0; j<results.length; j++){
															if(clone.text === results[j].text){
																exist = true; break;
															}
														}
														if(!exist)
															results.push(clone);
													}
													//res.status(200).json({results: results, error: err});
													Service.find(query).limit(2)
														.exec(function(err, services) {
															for(var i=0; i<services.length; i++){
																var clone = JSON.parse(JSON.stringify(services[i]));
																clone.text = services[i].product_type_name +" "+ services[i].brand_name +" "+ services[i].model +" "+ services[i].variant ;
																clone.type = "Service";
																
																var exist = false;
																for(var j=0; j<results.length; j++){
																	if(clone.text === results[j].text){
																		exist = true; break;
																	}
																}
																if(!exist)
																	results.push(clone);
															}
															res.status(200).json({results: results, error: err});
													});
											});
									});
										
							});			
						}
			});
	   }
	   else{
			res.status(200).json({results: [], error: null});
	   }
	}	
	
};




module.exports.getTransactions = function(req,res){//Fetch
	 //Check token validity
     if(req.payload.exp < (Date.now() / 1000)){                            
        res.status(440).json({
          "message" : "Session expired.",
          "url" : "/"
        });
     }

	// If no user ID exists in the JWT return a 401
    if (!req.payload.user_id) {
        res.status(401).json({
           "message" : "Unauthorized access."
        });
    }else {
       
	   var queries = req.body.queries;
	   var query = {};
		for (var key in queries) {
			if (queries.hasOwnProperty(key)) {
				//var q = {};
				query[key] = {$eq: queries[key]};
				//query.push(q);
			}
		}        
		if(req.body.city){ query.city = {$eq: req.body.city}; }
		if(req.body.location){ query.location = {$eq: req.body.location}; }
		query.deleted = {$ne: true};
		query.active = {$eq: "X"};
		var type = req.body.type;
		var results = [];
		
		var query_filter = {};
		query_filter.user_id = {"$eq":req.payload.user_id};
		query_filter.deleted = {"$ne": true};			
		Filter.find(query_filter,function(err_filter, result_filter){
					for(var i=0; i<result_filter.length; i++){
						if(result_filter[i].filter_value && result_filter[i].filter_field){//If Filter Value & Field is there
							var terms = [];
							if(query[result_filter[i].filter_field]){//If filter field already defined
								terms = query[result_filter[i].filter_field]['$in'];
								terms.push(result_filter[i].filter_value);
								query[result_filter[i].filter_field] = {'$in': terms};
							}
							else{
								terms = [];
								terms.push(result_filter[i].filter_value);
								query[result_filter[i].filter_field] = {'$in': terms};								
							}
							
						}
					}
		
					if(type === "Sale"){
						Sell.find(query).limit(10)
							.exec(function(err, result) {
								for(var i=0; i<result.length; i++){
									var clone = JSON.parse(JSON.stringify(result[i]));
									//clone.text = result[i].product_type_name +" "+ result[i].brand_name +" "+ result[i].model +" "+ result[i].variant ;
									clone.type = "Sale";
									results.push(clone);
								}
								res.status(200).json({results: results, error: err});
						});
					}
					else if(type === "Buy"){
						Buy.find(query).limit(10)
							.exec(function(err, result) {
								for(var i=0; i<result.length; i++){
									var clone = JSON.parse(JSON.stringify(result[i]));
									//clone.text = result[i].product_type_name +" "+ result[i].brand_name +" "+ result[i].model +" "+ result[i].variant ;
									clone.type = "Buy";
									results.push(clone);
								}
								res.status(200).json({results: results, error: err});
						});
					}
					else if (type === "Bid"){
						Bid.find(query).limit(10)
							.exec(function(err, result) {
								for(var i=0; i<result.length; i++){
									var clone = JSON.parse(JSON.stringify(result[i]));
									//clone.text = result[i].product_type_name +" "+ result[i].brand_name +" "+ result[i].model +" "+ result[i].variant ;
									clone.type = "Bid";
									results.push(clone);
								}
								res.status(200).json({results: results, error: err});
						});
					}
					else if(type === "Service"){
						Service.find(query).limit(10)
							.exec(function(err, result) {
								for(var i=0; i<result.length; i++){
									var clone = JSON.parse(JSON.stringify(result[i]));
									//clone.text = result[i].product_type_name +" "+ result[i].brand_name +" "+ result[i].model +" "+ result[i].variant ;
									clone.type = "Service";
									results.push(clone);
								}
								res.status(200).json({results: results, error: err});
						});
					}
					else{
						Sell.find(query).limit(5)
							.exec(function(err, sales) {
								for(var i=0; i<sales.length; i++){
									var clone = JSON.parse(JSON.stringify(sales[i]));
									//clone.text = sales[i].product_type_name +" "+ sales[i].brand_name +" "+ sales[i].model +" "+ sales[i].variant ;
									clone.type = "Sale";
									results.push(clone);
								}
								//res.status(200).json({results: result, error: err});
								Buy.find(query).limit(5)
									.exec(function(err, buy) {
										for(var i=0; i<buy.length; i++){
											var clone = JSON.parse(JSON.stringify(buy[i]));
											//clone.text = buy[i].product_type_name +" "+ buy[i].brand_name +" "+ buy[i].model +" "+ buy[i].variant ;
											clone.type = "Buy";
											results.push(clone);
										}
										//res.status(200).json({results: result, error: err});
										Bid.find(query).limit(5)
											.exec(function(err, bids) {
												for(var i=0; i<bids.length; i++){
													var clone = JSON.parse(JSON.stringify(bids[i]));
													//clone.text = bids[i].product_type_name +" "+ bids[i].brand_name +" "+ bids[i].model +" "+ bids[i].variant ;
													clone.type = "Bid";
													results.push(clone);
												}
												//res.status(200).json({results: results, error: err});
												Service.find(query).limit(5)
													.exec(function(err, services) {
														for(var i=0; i<services.length; i++){
															var clone = JSON.parse(JSON.stringify(services[i]));
															//clone.text = bids[i].product_type_name +" "+ bids[i].brand_name +" "+ bids[i].model +" "+ bids[i].variant ;
															clone.type = "Service";
															results.push(clone);
														}
														res.status(200).json({results: results, error: err});
												});
										});
								});
									
						});			
					}
		});
	}	
	
};


module.exports.searchLoc = function(req,res){//Fetch
	 //Check token validity
     if(req.payload.exp < (Date.now() / 1000)){                            
        res.status(440).json({
          "message" : "Session expired.",
          "url" : "/"
        });
     }

	// If no user ID exists in the JWT return a 401
    if (!req.payload.user_id) {
        res.status(401).json({
           "message" : "Unauthorized access."
        });
    }else {
       //var query = {};//{ $or: [{ tags: { $in: [ /^be/, /^st/ ] } }]};
	   if(req.query.term){
		   var terms = [];
		   terms.push(new RegExp(req.query.term, 'i'));
		   
		   var ands = [
							{deleted: {$ne: true}},
							{ $or:
								  [
								   {country:  { $in: terms }},
								   {state:  { $in: terms }},
								   {city:  { $in: terms }},
								   {location:  { $in: terms }}
								  ]
							}
						];
			var query = {$and: ands};
			var results = [];
			Loc.find(query).limit(3)
					.exec(function(err, result) {
						for(var i=0; i<result.length; i++){
							var clone = JSON.parse(JSON.stringify(result[i]));
							clone.text = result[i].location +", "+ result[i].city +", "+ result[i].country ;
							results.push(clone);
						}
						res.status(200).json({results: results, error: err});
            });
	   }
	   else{
		   res.status(200).json({results: [], error: null});
	   }
	}
			
};


