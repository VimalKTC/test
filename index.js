//importing modules
var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var cors = require('cors');
var path = require('path');
var passport = require('passport');
var app = express();

// [SH] Bring in the data model
require('./config/db');

const route = require('./route');
require('./config/passport');

//port
const port = 3000;

app.use(cors());
app.use(bodyparser.json({limit: '50mb'}));
app.use(bodyparser.urlencoded({limit: '50mb', extended: true}));
//app.use(bodyparser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use('/api',route);
/*app.use('/address',require('./routes/address'));
app.use('/alert',require('./routes/alert'));
app.use('/subscription',require('./routes/subscription'));
app.use('/fav',require('./routes/favourite'));
app.use('/filter',require('./routes/filter'));
app.use('/sell',require('./routes/sell'));
app.use('/buy',require('./routes/buy'));
app.use('/bid',require('./routes/bid'));
app.use('/bidBy',require('./routes/bidBy'));
app.use('/thumbnail',require('./routes/thumbnail'));
app.use('/image',require('./routes/image'));*/


app.listen(port,()=>{
	console.log('server started:'+port);
});