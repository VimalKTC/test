var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
	user_id:{
		type: String,
		required: true,
		index: true,
		unique: true
	},
	admin:{
		type: String,
		//required: true
	},
	mobile:{
		type: String,
		index: true,
		unique: true,
		required: true
	},
	hash: String,
	salt: String
});

UserSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

UserSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

UserSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setTime(expiry.getTime() + (1*60*60*1000));//1 Hour Life Span

  return jwt.sign({
    //_id: this._id,
    user_id: this.user_id,
    mobile: this.mobile,
	admin: this.admin,
    exp: parseInt(expiry.getTime() / 1000),
  }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

UserSchema.index({ user_id: 1, mobile: 1},{unique: true});
mongoose.model('User', UserSchema);
