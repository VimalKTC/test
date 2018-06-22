var mongoose = require('mongoose');
var gracefulShutdown;
var dbURI = 'mongodb://localhost/meanApp';
if (process.env.NODE_ENV === 'production') {
  dbURI = process.env.MONGOLAB_URI;
}

mongoose.connect(dbURI);

// CONNECTION EVENTS
mongoose.connection.on('connected', function() {
  console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function(err) {
  console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function() {
  console.log('Mongoose disconnected');
});

// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
gracefulShutdown = function(msg, callback) {
  mongoose.connection.close(function() {
    console.log('Mongoose disconnected through ' + msg);
    callback();
  });
};
// For nodemon restarts
process.once('SIGUSR2', function() {
  gracefulShutdown('nodemon restart', function() {
    process.kill(process.pid, 'SIGUSR2');
  });
});
// For app termination
process.on('SIGINT', function() {
  gracefulShutdown('app termination', function() {
    process.exit(0);
  });
});
// For Heroku app termination
process.on('SIGTERM', function() {
  gracefulShutdown('Heroku app termination', function() {
    process.exit(0);
  });
});

// BRING IN YOUR SCHEMAS & MODELS
//admin schemas
require('../models/users');
require('../models/profile');
require('../models/subscription');
require('../models/spec_fields');
require('../models/screens');
require('../models/role');
require('../models/product_type');
require('../models/product_thumbnail');
require('../models/product_spec');
require('../models/product_image');
require('../models/product_hierarchy');
require('../models/product');
require('../models/prd_typ_spec_field_map');
require('../models/otp');
require('../models/fields');
require('../models/brand');
require('../models/application');
require('../models/app_scr_fields_rights');
require('../models/country_state_city_loc');
require('../models/parameter');

//endusers schemas
require('../models/enduser/bid');
require('../models/enduser/bid_by');
require('../models/enduser/buy_request');
require('../models/enduser/favourite');
require('../models/enduser/filter');
require('../models/enduser/images');
require('../models/enduser/sell');
require('../models/enduser/thumbnails');
require('../models/enduser/user_address');
require('../models/enduser/user_alert');
require('../models/enduser/user_sub_map');
require('../models/enduser/service');
require('../models/enduser/feedback');
require('../models/enduser/rating');
require('../models/enduser/thumbs_up');
require('../models/enduser/thumbs_down');