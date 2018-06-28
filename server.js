//importing modules
var express = require('express');
var bodyparser = require('body-parser');
var cors = require('cors');
var path = require('path');
var app = express();

const port = 3000;

app.use(cors());
app.use(bodyparser.json({limit: '50mb'}));
app.use(bodyparser.urlencoded({limit: '50mb', extended: true}));


app.get('/', function (req, res) {
     res.sendFile(path.join(__dirname+'/views/index.html'));
});



app.listen(port,()=>{
	console.log('server started:'+port);
});