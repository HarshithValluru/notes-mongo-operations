const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
    email:{
        type : String,
        required : true,
        trim : true,
        minlength : 1,
        unique : true,
        validate:{
            validator : validator.isEmail,
            message : '{VALUE} is not a valid email.'
        }
    },
    password:{
        type : String,
        required : true,
        minlength: 6
    },
    tokens:[{
        access:{
            type : String,
            required: true
        },
        token:{
            type : String,
            required: true
        }
    }]
});
UserSchema.methods.generateAuthToken = function(){      //since 'this' cant be used in Arrow functions
    var user = this;
    var access = "auth";
    //var token = jwt.sign({_id:user._id.toHexString(),access},"123abc");
    var token = jwt.sign({access},"123abc");
    //user.tokens = user.tokens.concat([{access,token}]); OR
    user.tokens.push({access,token});
    // user.save().then((token)=>{
    //     console.log("token in user.js::",token);
    //     return token;
    // });
    return user;
};
var User = mongoose.model("User",UserSchema);

module.exports = {User}
// OR module.exports = {User : User}
// OR module.exports.User = User;