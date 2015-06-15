// load the things we need
var mongoose = require('mongoose');

//// define the schema for our user model
var user = mongoose.Schema({

    users            : {
        email        : String,
        username    : String,
        score:Number,
        collected_balls:[{name: String,lat:Number,lon:Number,pos_accuracy:String,pos_speed:String,timestamp:String}]
}
});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', user);
