var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

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
    //console.log("id:",id);
    if(!ObjectID.isValid(id))
        return res.status(400).send({err:"Invalid ID via objectID"});
    Todo.findById(id).then((docs)=>{
        if(!docs)
            //res.status(404).send({"err":"Id not found"});
            return res.status(404).send();
        res.status(200).send({docs});
    },(err)=>{                                      //control comes here iff 'if' in line-32 is removed. 
        res.status(400).send({err:"Invalid ID"});
    });
});

app.delete("/todos/:id",(req,res)=>{
    var id = req.params.id;
    console.log(id);
    if(!ObjectID.isValid(id)){
        console.log("Invalid object");
        return res.status(400).send();
    }
    Todo.findByIdAndRemove(id).then((docs)=>{
        if(!docs){
            console.log("Returns false");
            return res.status(404).send();
        }
        console.log("Returns true");
        res.status(200).send({docs});
    },(error)=>{
        res.status(400).send();
    })
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
module.exports = {app};