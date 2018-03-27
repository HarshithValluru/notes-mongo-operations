var mongoose = require('mongoose');

var User = mongoose.model("User",{
    email:{
        type : String,
        required : true,
        trim: true,
        minlength: 1
    }
});

module.exports = {User}
// OR module.exports = {User : User}
// OR module.exports.User = User;