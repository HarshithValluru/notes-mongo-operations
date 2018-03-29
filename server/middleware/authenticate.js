const {User} = require('./../models/user');

//Providing a middleware function()
var authenticate = (req,res,next) => {
    var token = req.header("x-auth");
    User.findByToken(token).then((user)=>{
        if(!user)
            return Promise.reject();
        req.user = user;
        next();
    },(err)=>{
        res.status(401).send();
    });
}
module.exports = {authenticate};