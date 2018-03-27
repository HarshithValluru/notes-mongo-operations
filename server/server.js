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
    //res.end();
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

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
module.exports = {app};