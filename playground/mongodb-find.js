// const MongoClient = require('mongodb').MongoClient;
// OR
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect("mongodb://localhost:27017/",(err,client)=>{
    if(err){
        return console.log("Unable to Connect to MongoDB server");
    }
    console.log("Connected to MongoDB server");
    const db = client.db("TodoApp");

    db.collection("Todos").find({
        _id : new ObjectID("5ab4e6fbb1e8103978840319")
    }).toArray().then((docs)=>{
        console.log(JSON.stringify(docs,undefined,2));
    },(err)=>{
        console.log(err);
    });
    
    client.close();
});