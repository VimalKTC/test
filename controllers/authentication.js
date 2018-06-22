var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Profile = mongoose.model('Profile');
var Otp = mongoose.model('Otp');

module.exports.register = function(req, res) {
	var query_otp = {};
	query_otp.mobile = {"$eq":req.body.mobile};
	query_otp.otp = {"$eq":req.body.otp};
	Otp.find(query_otp,function(err_otp, otps){
		if(err_otp){
			res.json({"statusCode":"F","msg":"Unable to validate OTP.","error":err_otp});
		}
		//else if(otps.length>0){
		else if(true){
						//Register Here
						var user_id = "1";
						var command = User.find().sort({"user_id":-1}).limit(1);
						command.exec(function(err, maxValue) 
						{	
							if(maxValue.length && maxValue.length > 0){
								user_id = user_id - (- maxValue[0].user_id);
							}
							else{
								user_id = "1000";
							}
						
							  var user = new User();
							  user.user_id = user_id;
							  user.mobile = req.body.mobile;
							  user.admin = req.body.admin;
							  user.setPassword(req.body.password);

							  user.save(function(save_err,result) {
								  if(save_err){
									res.status(400);
									res.json({
									  "statusCode": "F",
									  "msg":"Unable to register.",
									  "error": save_err
									});
								  }
								  else{
									var d = new Date();
									var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
									let newUserProfile = new Profile({
										user_id: user_id,
										admin: req.body.admin,
										mobile: req.body.mobile,
										name: "",
										gender: "",
										email: "",
										currency: "",
										walletAmount: "",
										mobile_verified: "X",
										email_verified: "",
										deleted: false,
										createdBy: user_id,
										createdAt: at,
										changedBy: user_id,
										changedAt: at
									});
									
									newUserProfile.save((err, user)=>{
									});
									var token;
									token = user.generateJwt();
									res.status(200);
									res.json({
									  "token" : token,
									  "statusCode": "S",
									  "results": result
									});
								  }
							  });
						});
		}
		else{
			res.json({"statusCode":"F","msg":"Unable to validate OTP.","error":err_otp});
		}
	});
			

};

module.exports.login = function(req, res) {
  passport.authenticate('local', function(err, user, info){
    var token;

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if(user){
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);

};