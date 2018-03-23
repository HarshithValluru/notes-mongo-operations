const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect("mongodb://localhost:27017/TodoApp",(err,client)=>{
    if(err){
        return console.log("Unable to Connect to MongoDB server");
    }
    console.log("Connected to MongoDB server");
    const db = client.db("TodoApp");
    var collection = db.collection('Todos');
    //remove
    collection.remove({}).then((result)=>{console.log(result)});
    //deleteMany
    //collection.deleteMany({text : "Eat lunch"}).then((result)=>{console.log(result)});
    //deleteOne
    //collection.deleteOne({text : "Eat lunch"}).then((result)=>{console.log(result)});
    //findOneAndDelete
    // collection.findOneAndDelete({_id : new ObjectID("5ab38adcc5298c32acec3869")})
    //     .then((result)=>{console.log(result)});
    client.close();
});