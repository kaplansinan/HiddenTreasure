// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
// load up the user model
var User       		= require('../model/models');
// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
 // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'login'    

passport.use('login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'username',
        passReqToCallback : true 
    },
    function(req, email, username, done) {

          // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'users.email' :  email }, function(err, user) {
            if (err)
                return done(err);
            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupError', 'Email is already taken.'));
            } 
            else {
                
                // if there is no user with that email
                // create the user
			    var newUser            = new User();
                // set the user's local credentials
                newUser.users.email    = email;
                newUser.users.username = username; 
                 // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;

                    return done(null, newUser);
                });
                }

        });

    }));


};

