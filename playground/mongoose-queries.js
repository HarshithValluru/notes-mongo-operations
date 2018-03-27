const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = "5ab8c3802abf66376406a75e2";
// Todo.find({_id:id}).then((docs)=>{                      // Returns an array of documents
//     console.log(docs)
// }).catch((err)=>console.log("find: Invalid length"));
// Todo.findOne({_id:id}).then((docs)=>{                   // Returns only one document. Not in Array
//     if(!docs)
//         return console.log("findOne: Id not found");
//     console.log(docs);
// }).catch((err)=>console.log("findOne: Invalid length"));
// Todo.findById(id).then((docs)=>{
//     if(!docs)
//         return console.log("findById: Id not found");
//     console.log(docs);
// }).catch((err)=>console.log("findById: Invalid length",err));

var id = "5ab4cf6a0a43a7213c40b4f0";
User.findById(id).then((docs)=>{
    if(!docs)
        return console.log("Id not found");
    console.log(JSON.stringify(docs,undefined,2));
},(err)=>console.log("Invalid ID: ",err));