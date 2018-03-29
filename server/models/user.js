const mongoose = require('mongoose');
const validator = require('validator');
const lodash = require('lodash');
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
//Instance Methods
UserSchema.methods.toJSON = function(){
    var user = this;
    //var userObject = user.toObject();
    return lodash.pick(user,["_id","email"]);
};
UserSchema.methods.generateAuthToken = function(){      //since 'this' cant be used in Arrow functions
    var user = this;
    var access = "auth";
    var token = jwt.sign({_id:user._id.toHexString(),access},"123abc");
    //var token = jwt.sign({access},"123abc");
    //user.tokens = user.tokens.concat([{access,token}]); OR
    user.tokens.push({access,token});
    return user.save().then(()=>{
        return token;
    });
    //return user;
};
//Model Method
UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;
    try{
        decoded = jwt.verify(token,"123abc");
    } catch(err){
        return Promise.reject();
    }
    return User.findOne({
        "_id" : decoded._id,
        "tokens.token" : token,
        "tokens.access": "auth"
    })
};

var User = mongoose.model("User",UserSchema);

module.exports = {User}
// OR module.exports = {User : User}
// OR module.exports.User = User;