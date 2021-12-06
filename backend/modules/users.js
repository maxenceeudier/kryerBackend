var mongoose = require ('mongoose');

var userSchema = mongoose.Schema({
    token:Number,
    avatar:String,
    firstName:String,
    lastName:String,
    email:String,
    phone:Number,
    password:String,
    avg_rating:Number,
    rating_count:Number,
    idCard_check:Boolean,
    missions:[{type: mongoose.Schema.Types.ObjectId, ref:'missions'}]

});

var userModel = mongoose.model('users', userSchema);


module.exports = userModel;