
const async = require("async");
const request = require('request');
var mongoose = require('mongoose');

//////////////////////////Send Notification////////////////////////////////
var Profile = mongoose.model('Profile');
var UserSubMap = mongoose.model('UserSubMap');
var UserAlert = mongoose.model('UserAlert');

module.exports.sendNotification = function(doc){//Send
	//Trigger Notification	
	var query_alert = {};
	query_alert.deleted = {"$ne": true};
	query_alert.active = {"$eq": true};
	if(doc.transactionType)
		query_alert.bid_sell_buy = {"$in": [doc.transactionType, 'All']};	
	if(doc.listing_by)
		query_alert.individual_dealer = {"$eq": doc.listing_by};
	if(doc.product_type_name)
		query_alert.product_type_name = {"$eq": doc.product_type_name};
	if(doc.brand_name)
		query_alert.brand_name = {"$eq": doc.brand_name};
	if(doc.model)
		query_alert.model = {"$eq": doc.model};	
	if(doc.variant)
		query_alert.variant = {"$eq": doc.variant};	
	if(doc.fuel_type)
		query_alert.fuel_type = {"$eq": doc.fuel_type};	
	if(doc.city)
		query_alert.city = {"$eq": doc.city};	
	if(doc.current_bid_amount){
		query_alert.price_from = {"$lt": doc.current_bid_amount};
		query_alert.price_to = {"$gt": doc.current_bid_amount};
	}
	if(doc.net_price){
		query_alert.price_from = {"$lt": doc.net_price};
		query_alert.price_to = {"$gt": doc.net_price};
	}
	if(doc.start_from_amount){
		query_alert.price_from = {"$lt": doc.start_from_amount};
		query_alert.price_to = {"$gt": doc.start_from_amount};
	}
	
	if(doc.km_done){
		query_alert.km_run_from = {"$lt": doc.km_done};
		query_alert.km_run_to = {"$gt": doc.km_done};
	}
	if(doc.year_of_reg){
		query_alert.year_of_reg_from = {"$lt": doc.year_of_reg};
		query_alert.year_of_reg_to = {"$gt": doc.year_of_reg};
	}
		
	UserAlert.find(query_alert,function(err_alert, result_alert){
				if(err_alert){
					console.log(err_alert);
				}
				else{
					for(var i = 0; i<result_alert.length; i++){
							var query_userSub = {};
							query_userSub.user_id = {"$eq": result_alert[i].user_id};
							query_userSub.active = {"$eq": "X"};	
							query_userSub.deleted = {"$ne": true};	
							//Send SMS
							if(result_alert[i].sms){
									UserSubMap.find(query_userSub,function(err_userSub, result_userSub){
										if(err_userSub){
											console.log(err_userSub);
										}
										else{
											var sms_sent = false;
											for(var j = 0; j<result_userSub.length; j++){
												if(result_userSub[j].notification_sms === 'X' && !sms_sent){
													var query_profile = {};
													query_profile.user_id = {"$eq": result_userSub[j].user_id};
													query_profile.deleted = {"$ne": true};
													Profile.find(query_profile,function(profile_err, profiles){
														if(profiles.length > 0){
															if(profiles[0].mobile){
																request.post({
																	url:'https://api.textlocal.in/send/?', 
																	form: {
																			  'apikey': 'MN/ELO/CKoU-bT0VHaKrMJ3hPcLreDUlNj90PY0MqC',
																			  'message': 'Check out the new '+doc.brand_name+' '+doc.model+' posted for '+doc.transactionType+'.',
																			  'sender': 'TXTLCL',
																			  'numbers': '91'+profiles[0].mobile
																			}
																},
																function(err_sms,httpResponse,body){
																	console.log(err_sms);
																});
																sms_sent = true;
															}
														}
													});
												}												
											}
										}
									});
							}
							//Send EMAIL
							if(result_alert[i].email){
									UserSubMap.find(query_userSub,function(err_userSub, result_userSub){
										if(err_userSub){
											console.log(err_userSub);
										}
										else{
											var email_sent = false;
											for(var j = 0; j<result_userSub.length; j++){												
												if(result_userSub[j].notification_email === 'X' && !email_sent){
													var query_profile = {};
													query_profile.user_id = {"$eq": result_userSub[j].user_id};
													query_profile.deleted = {"$ne": true};
													Profile.find(query_profile,function(profile_err, profiles){
														if(profiles.length > 0){
															if(profiles[0].email){
																var data = {
																				"from":"OINAM <no-reply@oinam.com>",
																				"to": profiles[0].email,
																				"subject": doc.brand_name+' '+doc.model,
																				"text": 'Check out the new '+doc.brand_name+' '+doc.model+' posted for '+doc.transactionType+'.'
																};
																request.post({
																	url:'https://api.mailgun.net/v3/sandboxbd4811c4f46d4450987f8899b4c08721.mailgun.org/messages', 
																	form: data,
																	headers: {
																		'Authorization': 'Basic '+Buffer.from('api:key-3cf7952407982696ab3fec8171461271').toString('base64')
																		//btoa('api:key-3cf7952407982696ab3fec8171461271')
																	  }
																},
																function(err_email,httpResponse,body){
																	console.log(err_email);
																});
																email_sent = true;
															}
														}
													});
													
												}
											}
										}
									});
							}
							
							
							
							
							
							
							
							
							
							
							
						}
				}
	});
				
};

