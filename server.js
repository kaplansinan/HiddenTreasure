// server.js

// set up ======================================================================
// get all the tools we need
var http = require("http");
var path = require("path");
var express = require("express");
var app = express();
var passport = require("passport");
var mongoose = require('mongoose');
var morgan         = require('morgan');
var flash    = require('connect-flash');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var logger = require("express-logger");
var session = require('express-session');
var database = require('./config/database.js');
var User       		= require('./model/models');
// configuration ===============================================================
mongoose.connect(database.url); 
require('./config/passport')(passport); // pass passport for configuration
    // set up our express application
	app.use(morgan('dev'));
	app.use(cookieParser());// read cookies (needed for auth)
	app.use(bodyParser.json());// get information from html forms
    app.use(bodyParser.urlencoded());// get information from html forms
	app.set('view engine', 'ejs'); // set up ejs for templating
    
    // required for passport
	app.use(session({secret: 'Sinan'})); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session
	app.use(express.static(path.join(__dirname, 'public')));//define path for static files


// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://ct100020vir6.pc.lut.fi:1072');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});	

// routes ======================================================================
app.get("/home",isLoggedIns,function(req,res){
	res.render("home",{ message: req.flash('signupError') });
});

app.get("/",function(req,res){
	res.render("index.ejs"); // load the index.ejs file
});


app.get("/demo",function(req,res){
	var locations = [
		 ['Ball 1', 61.06501,28.09751],
		 ['Ball 2', 61.06597,28.09671],
		 ['Ball 3', 61.06668,28.09483],
		 ['Ball 4', 61.06734,28.09283],
		 ['Ball 5', 61.06658,28.09337],
		 ['Ball 6', 61.06591,28.09446]
 	];

 var lat = 61.065860;
 console.log("lat : " + lat);
 var lon = 28.096065;
 console.log("lon : " + lon);
 zoom = 15;
 console.log("zoom : " + zoom);
 console.log("demo");
	res.render("demo.ejs",{user : req.user,layout: false,loc:locations,lat:lat, lon:lon, zoom:zoom});
});

/*app.get("/",isLoggedIns,function(req,res){
	res.render("index.ejs",{ message: req.flash('signupError') });
});*/

//if track is triggered
app.get("/track",function(req,res){
  res.render("create_track.ejs");
});

// =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
app.post("/login",passport.authenticate('login', {
		successRedirect : '/tracks', 
		failureRedirect : '/home',
		failureFlash : true 
}));

//tracks oage render after log in form successfull
app.get("/tracks",isLoggedIn,function(req,res)
{
  res.render("tracks.ejs");
});

app.get("/signup",isLoggedIns,function(req,res){
	res.render("signup.ejs",{ message: req.flash('signupError') });
});

app.post("/signup",passport.authenticate('signup', {
		successRedirect : '/profile', 
		failureRedirect : '/signup',
		failureFlash : true 
}));

// =====================================
    // PROFILE SECTION =====================
    // =====================================	
app.post("/profile", function(req, res){
      //var obj = {};

   if (req.user) { // Check if session exists
    // lookup the user in the DB by pulling their email from the session
    User.findOne({ "_id": req.user.id }, function (err, user) {
      if (!user) {
        // if the user isn't found in the DB, reset the session info and
        // redirect the user to the login page
        //req.session.reset();
        //res.redirect('/login');
        console.log("user not found");
      } else {
        // expose the user to the template
        //res.locals.user = user;

        // render the dashboard page
        //res.render('dashboard.jade');
        console.log("user found");
        //console.log(user.users.collected_balls);
       //console.log(req.session);
      var name=req.body.name;
      var lat=req.body.lat;
      var lon=req.body.lon;
      var pos_accuracy=req.body.pos_accuracy;
      var pos_speed=req.body.pos_speed;
      var timestamp=req.body.pos_timestamp;
      console.log('body:\t ' + name+'lat:\t'+lat+'lon:\t'+lon);

      var ball={name:name,lat:lat,lon:lon,pos_accuracy:pos_accuracy,pos_speed:pos_speed,timestamp:timestamp};
      user.users.collected_balls.name=name;
      user.users.collected_balls.lat=lat;
      user.users.collected_balls.lon=lon;
      user.users.collected_balls.pos_accuracy=pos_accuracy;
      user.users.collected_balls.pos_speed=pos_speed;
      user.users.collected_balls.timestamp=timestamp;

     user.users.collected_balls.push(ball);
     user.users.save(function(err) {
        if (err) throw err;

        console.log('User saved successfully!');
      });
      console.log(user.users.collected_balls.name);
      console.log(user.users.collected_balls.lat);



      }
    });
  } else {
    console.log("cannot found session");
  }


      res.sendStatus(200);
      
});


app.get("/profile",isLoggedIn,function(req,res)
{

var locations = [
		 ['Ball 1', 61.06501,28.09751],
		 ['Ball 2', 61.06597,28.09671],
		 ['Ball 3', 61.06668,28.09483],
		 ['Ball 4', 61.06734,28.09283],
		 ['Ball 5', 61.06658,28.09337],
		 ['Ball 6', 61.06591,28.09446]
 	];


 var lat = 61.065860;
 console.log("lat : " + lat);
 var lon = 28.096065;
 console.log("lon : " + lon);
 zoom = 15;
 console.log("zoom : " + zoom);


	res.render("profile.ejs",{user : req.user,layout: false,loc:locations,lat:lat, lon:lon, zoom:zoom});

});


app.get('/logout',isLoggedIn, function(req, res) {
		   	req.logout();
		res.redirect('/');
});


//404 access 
app.get("/*",function(req,res){
	res.render("404.ejs");
});


function isLoggedIn(req, res, next) {

	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}

// route middleware to make sure a user is logged in
function isLoggedIns(req, res, next) {
    // if user is authenticated in the session, carry on
	if (req.isAuthenticated())
	res.redirect('/profile');
	else
        // if they aren't redirect them to the home page
		return next();
}

app.listen(1072);
console.log("Application started ! working on port 1072");