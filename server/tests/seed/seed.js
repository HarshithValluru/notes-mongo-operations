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
        token : jwt.sign({_id : userOneId, access : "auth"},process.env.JWT_SECRET).toString()
    }]
},{
    _id : userTwoId,
    email : "123@abc.com",
    password : "password2",
    tokens : [{
        access : "auth",
        token : jwt.sign({_id : userTwoId, access : "auth"},process.env.JWT_SECRET).toString()
    }]
}];

const todos = [{
    _id : new ObjectID(),
    text : "First todo",
    _creator : userOneId
},{
    _id : new ObjectID(),
    text : "Second todo",
    completed : true,
    completedAt : 12131,
    _creator : userTwoId
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