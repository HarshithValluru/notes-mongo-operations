const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id : userOneId,
    email : "abc@123.com",
    password : "password1",
    tokens : [{
        access : "auth",
        token : jwt.sign({_id : userOneId, access : "auth"},"123abc").toString()
    }]
},{
    _id : userTwoId,
    email : "123@abc.com",
    password : "password2"
}];

const todos = [{
    _id : new ObjectID(),
    text : "First todo"
},{
    _id : new ObjectID(),
    text : "Second todo",
    completed : true,
    completedAt : 12131
}];

const populateTodos = (done)=>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos);
    }).then(()=>done());
};

const populateUsers = (done)=>{
    User.remove({}).then(()=>{
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        return Promise.all([userOne, userTwo]).then(()=>done());
    });
};

module.exports = {todos, populateTodos, users, populateUsers};