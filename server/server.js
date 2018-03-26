var express = require('express');
var bodyParser = require('body-parser');

var port = process.env.port || 3000 ;
console.log("port ==",port);
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

app.listen(port, () => {
    console.log("Server started on port 3000.");
});
module.exports = {app};