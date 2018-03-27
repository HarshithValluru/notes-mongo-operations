const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

//Todo.remove({});
//Todo.findOneAndRemove()
Todo.findByIdAndRemove("5ab9ce45f76e2e23645b1dfb").then((result)=>{
    console.log(result);
});