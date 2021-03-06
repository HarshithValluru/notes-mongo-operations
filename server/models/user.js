const mongoose = require('mongoose');
const validator = require('validator');
const lodash = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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
    var token = jwt.sign({_id:user._id.toHexString(),access},process.env.JWT_SECRET);
    //var token = jwt.sign({access},"123abc");
    //user.tokens = user.tokens.concat([{access,token}]); OR
    user.tokens.push({access,token});
    return user.save().then(()=>{
        return token;
    });
    //return user;
};
UserSchema.methods.removeToken = function(token){
    var user = this;
    return user.update({
        $pull : {
            tokens : {token}
        }
    });
};

//Model Methods
UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;
    try{
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch(err) {
        return Promise.reject();
    }
    return User.findOne({
        "_id" : decoded._id,
        "tokens.token" : token,
        "tokens.access": "auth"
    })
};
UserSchema.statics.findByCredentials = function(email,password){
    var User = this;
    return User.findOne({email}).then((user)=>{
        if(!user)
            return Promise.reject();
        return new Promise((resolve,reject)=> {
            bcrypt.compare(password,user.password,(err,res)=>{
                if(res)
                    resolve(user);
                else
                    reject();
            });
        });
    },(err)=>{
        return err;
    });
};

UserSchema.statics.findByCredentials = function(email,pwd) {
	var User = this;
	return User.findOne({"email":email}).then((userDetails)=>{
		if(!userDetails)
			return Promise.reject();
		//bcrypt library functions supports only callbacks but not Promises. Since we need a promise object, we will create a new Promise Object with a callBack function.
		return new Promise((resolve,reject)=>{
			bcrypt.compare(pwd,userDetails.password,(err,res)=>{
				if(res)
					resolve(userDetails);
				else
					reject();
			});
		});
	});
};

UserSchema.pre("save",function(next){
    var user = this;
    if(user.isModified("password")){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password = hash;
                next();
            });
        });
    }else
        next();
});
var User = mongoose.model("User",UserSchema);

module.exports = {User}
// OR module.exports = {User : User}
// OR module.exports.User = User;