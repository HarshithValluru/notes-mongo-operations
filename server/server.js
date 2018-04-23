require('./config/config.js');

const express = require('express');
const bodyParser = require('body-parser');
const lodash = require('lodash');
const {ObjectID} = require('mongodb');

var port = process.env.PORT || 3000 ;
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
app.use(bodyParser.json());

app.post('/todos', authenticate,(req,res)=>{
    var newTodo = new Todo({
        text : req.body.text,
        _creator : req.user._id
    }).save().then( (doc) => res.send(doc),
        (err) => res.status(400).send(err)
    );
});
app.get('/todos', authenticate, (req,res) => {
    Todo.find({
        _creator : req.user._id
    }).then((todos)=>{
        res.send({todos});
    },(err)=>{
        res.status(400).send(todos);
    });
})

app.get('/todos/:id', authenticate, (req,res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id))
        return res.status(400).send({err:"Invalid ID via objectID"});
    Todo.findOne({
        _id : id,
        _creator : req.user._id
    }).then((docs)=>{
        if(!docs)
            return res.status(404).send({"err":"Id not found"});
            //return res.status(404).send();
        res.status(200).send({docs});
    },(err)=>{                                      //control comes here iff 'if' in line-32 is removed. 
        res.status(400).send({err:"Invalid ID"});
    });
});

app.delete("/todos/:id", authenticate, (req,res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id))
        return res.status(400).send({err:"Invalid ID via objectID"});
    Todo.findOneAndRemove({
        _id : id,
        _creator : req.user._id
    }).then((docs)=>{
        if(!docs)
            return res.status(404).send({"err":"Id not found"});
        res.status(200).send({docs});
    },(error)=>{
        res.status(400).send({err:"Invalid ID"});
    })
});

app.patch("/todos/:id", authenticate, (req,res)=>{
    var id = req.params.id;
    var body = lodash.pick(req.body,["text","completed"]);
    if(!ObjectID.isValid(id))
        return res.status(400).send({err:"Invalid ID via objectID"});
    if(lodash.isBoolean(body.completed) && body.completed)
        body.completedAt = new Date().getTime();
    else{
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findOneAndUpdate({
        _id : id,
        _creator : req.user._id
    }, {$set :body}, {new:true} ).then((docs)=>{
        if(!docs)
            return res.status(404).send();
        res.status(200).send({docs});
    },(err)=>res.status(400).send());
});

app.post("/users",(req,res)=>{
    var body = lodash.pick(req.body,["email","password"]);
    var newUser = new User(body);
    newUser.save().then(()=>{
        return newUser.generateAuthToken();
    }).then((token)=>{
        res.header("x-auth",token).send(newUser);
    },(err)=>{
        res.status(400).send({"err":"Unable to push record"});
    });
});

app.post("/users/login",(req,res)=>{
    var body = lodash.pick(req.body,["email","password"]);
    User.findByCredentials(body.email,body.password).then((user)=>{
        user.generateAuthToken().then((token)=>{
            res.header("x-auth",token).send(user);
        });
    }).catch((err)=>{
        res.status(400).send(err);
    });
});

app.get("/users/me", authenticate, (req,res)=>{
    res.send(req.user);
});

app.get('/users', (req,res) => {
    User.find().then((users)=>{
        res.send({users});
    },(err)=>{
        res.status(400).send(users);
    });
});

app.get('/users/:id', (req,res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id))
        return res.status(400).send({err:"Invalid ID via objectID"});
    User.findById(id).then((docs)=>{
        if(!docs)
            return res.status(404).send({"err":"Id not found"});
            //return res.status(404).send();
        res.status(200).send({docs});
    },(err)=>{                                      //control comes here iff 'if' in line-32 is removed. 
        res.status(400).send({err:"Invalid ID"});
    });
});

// app.delete("/users/:id",(req,res)=>{
//     var id = req.params.id;
//     if(!ObjectID.isValid(id))
//         return res.status(400).send({err:"Invalid ID via objectID"});
//     User.findByIdAndRemove(id).then((docs)=>{
//         if(!docs)
//             return res.status(404).send({"err":"Id not found"});
//         res.status(200).send({docs});
//     },(error)=>{
//         res.status(400).send({err:"Invalid ID"});
//     })
// });

app.delete("/users/me/token",authenticate,(req,res)=>{
    req.user.removeToken(req.token).then(()=>{
        res.send();
    },(err)=>res.send(err));
});

app.delete("/users/me/token",(req,res)=>{
	
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
module.exports = {app};