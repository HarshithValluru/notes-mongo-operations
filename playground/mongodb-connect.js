// const MongoClient = require('mongodb').MongoClient;
// OR
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect("mongodb://localhost:27017/TodoApp",(err,client)=>{
    if(err){
        return console.log("Unable to Connect to MongoDB server");
    }
    console.log("Connected to MongoDB server");
    const db = client.db("TodoApp");

    db.collection('Todos').insertOne({
        text : "something to do",
        completed : false
    },(err,result)=>{
        if(err)
            return console.log("Unable to insert todo",err);
        console.log(JSON.stringify(result.ops, undefined, 2));
    });
    
    // db.collection("Users").insertOne({
    //     name : "Harshith",
    //     age : 23,
    //     location : "Hyderabad"
    // }, (err,result)=>{
    //     if(err)
    //         return console.log("Unable to insert Users",err);
    //     console.log(JSON.stringify(result.ops,undefined,2));
    // });

    client.close();
});