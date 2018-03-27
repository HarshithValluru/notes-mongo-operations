const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect("mongodb://localhost:27017/TodoApp",(err,client)=>{
    if(err){
        return console.log("Unable to Connect to MongoDB server");
    }
    console.log("Connected to MongoDB server");
    const db = client.db("TodoApp");
    //findOneAndUpdate
    db.collection("Users").findOneAndUpdate({
        //_id : new ObjectID("5ab38c84100ef90490a27542") OR
        "name" : "Harshith"
    }, {
        $set : {
            location : "Kamalanagar, Vanasthalipuram, Hyderabad"
        },
        $inc : {
            age : 1
        }
    },{
        returnOriginal : false
    }).then( (result) => {
        console.log(result);
    });

    client.close();
});