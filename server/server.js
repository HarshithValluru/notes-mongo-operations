require('./../config/config');

const express = require('express');
const bodyParser = require('body-parser');
const lodash = require('lodash');
const {ObjectID} = require('mongodb');

var port = process.env.PORT || 3000 ;
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
    var newTodo = new Todo({
        text : req.body.text
    }).save().then( (doc) => res.send(doc),
        (err) => res.status(400).send(err)
    );
});
app.get('/todos', (req,res) => {
    Todo.find().then((todos)=>{
        res.send({todos});
    },(err)=>{
        res.status(400).send(todos);
    });
})

app.get('/todos/:id', (req,res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id))
        return res.status(400).send({err:"Invalid ID via objectID"});
    Todo.findById(id).then((docs)=>{
        if(!docs)
            return res.status(404).send({"err":"Id not found"});
            //return res.status(404).send();
        res.status(200).send({docs});
    },(err)=>{                                      //control comes here iff 'if' in line-32 is removed. 
        res.status(400).send({err:"Invalid ID"});
    });
});

app.delete("/todos/:id",(req,res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id))
        return res.status(400).send({err:"Invalid ID via objectID"});
    Todo.findByIdAndRemove(id).then((docs)=>{
        if(!docs)
            return res.status(404).send({"err":"Id not found"});
        res.status(200).send({docs});
    },(error)=>{
        res.status(400).send({err:"Invalid ID"});
    })
});

app.patch("/todos/:id",(req,res)=>{
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
    Todo.findByIdAndUpdate(id, {$set :body}, {new:true} ).then((docs)=>{
        if(!docs)
            return res.status(404).send();
        res.status(200).send({docs});
    },(err)=>res.status(400).send());
});

app.post("/users",(req,res)=>{
    var body = lodash.pick(req.body,["email","password"]);
    // var newUser = new User(body).generateAuthToken();
    // newUser.save().then((result)=>{
    //     var token = result.tokens[0].token;
    //     console.log(typeof token,"::",token);
    //     res.header(token).send({result})
    // },(err)=>res.status(400).send(err));
    var newUser = new User(body);
    newUser.save().then(()=>{
        return newUser.generateAuthToken();
    }).then((token)=>{
        console.log("Token::",token);
        res.header("x-auth",token).send({newUser});
    },(err)=>{
        console.log("err::",err);
        res.status(400).send({"err":"Unable to push record"});
    });
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

app.delete("/users/:id",(req,res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id))
        return res.status(400).send({err:"Invalid ID via objectID"});
    User.findByIdAndRemove(id).then((docs)=>{
        if(!docs)
            return res.status(404).send({"err":"Id not found"});
        res.status(200).send({docs});
    },(error)=>{
        res.status(400).send({err:"Invalid ID"});
    })
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
module.exports = {app};


