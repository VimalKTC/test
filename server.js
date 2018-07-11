//  Moto Clique Node application
//importing modules

var express = require('express'),
app     = express(),
morgan  = require('morgan');

Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'));


// BRING IN YOUR SCHEMAS & MODELS
//admin schemas
require('./models/users');
require('./models/profile');
require('./models/subscription');
require('./models/spec_fields');
require('./models/screens');
require('./models/role');
require('./models/product_type');
require('./models/product_thumbnail');
require('./models/product_spec');
require('./models/product_image');
require('./models/product_hierarchy');
require('./models/product');
require('./models/prd_typ_spec_field_map');
require('./models/otp');
require('./models/fields');
require('./models/brand');
require('./models/application');
require('./models/app_scr_fields_rights');
require('./models/country_state_city_loc');
require('./models/parameter');

//endusers schemas
require('./models/enduser/bid');
require('./models/enduser/bid_by');
require('./models/enduser/buy_request');
require('./models/enduser/favourite');
require('./models/enduser/filter');
require('./models/enduser/images');
require('./models/enduser/sell');
require('./models/enduser/thumbnails');
require('./models/enduser/user_address');
require('./models/enduser/user_alert');
require('./models/enduser/user_sub_map');
require('./models/enduser/service');
require('./models/enduser/feedback');
require('./models/enduser/rating');
require('./models/enduser/thumbs_up');
require('./models/enduser/thumbs_down');
require('./models/enduser/counter');

var mongoose = require('mongoose');
var passport = require('passport');
const route = require('./route');
require('./config/passport');

var bodyparser = require('body-parser');
var cors = require('cors');
var path = require('path');

app.use(cors());
app.use(bodyparser.json({limit: '50mb'}));
app.use(bodyparser.urlencoded({limit: '50mb', extended: true}));

app.use(express.static(path.join(__dirname, 'views')));

app.use(passport.initialize());
app.use('/api',route);



var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

// test push

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
      mongoPassword = process.env[mongoServiceName + '_PASSWORD']
      mongoUser = process.env[mongoServiceName + '_USER'];

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

  }
}
var db = null,
    dbDetails = new Object();

var initDb = function(callback) {
  if (mongoURL == null) return;

  var mongodb = require('mongodb');
  if (mongodb == null) return;

  mongodb.connect(mongoURL, function(err, conn) {
    if (err) {
      callback(err);
      return;
    }

    db = conn;
    dbDetails.databaseName = db.databaseName;
    dbDetails.url = mongoURLLabel;
    dbDetails.type = 'MongoDB';

    console.log('Connected to MongoDB at: %s', mongoURL);
  });
  
  mongoose.connect(mongoURL);
};


app.get('/', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    var col = db.collection('counts');
    // Create a document with request IP and current time of request
    col.insert({ip: req.ip, date: Date.now()});
    col.count(function(err, count){
      if (err) {
        console.log('Error running count. Message:\n'+err);
      }
      res.render('index.html', { pageCountMessage : count, dbInfo: dbDetails });
    });
  } else {
    res.render('index.html', { pageCountMessage : null});
  }
});


app.get('/pagecount', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    db.collection('counts').count(function(err, count ){
      res.send('{ pageCount: ' + count + '}');
    });
  } else {
    res.send('{ pageCount: -1 }');
  }
});

app.get('*', function (req, res) {
      // try to initialize the db on every request if it's not already
      if (!db) {
        initDb(function(err){});
      }
      if (db) {
        var col = db.collection('counts');
        // Create a document with request IP and current time of request
        col.insert({ip: req.ip, date: Date.now()});
        col.count(function(err, count){
          if (err) {
            console.log('Error running count. Message:\n'+err);
          }
          res.render('index.html', { pageCountMessage : count, dbInfo: dbDetails });
        });
      } else {
        res.render('index.html', { pageCountMessage : null});
      }
});


// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);
console.log('server started:'+port);

module.exports = app ;
