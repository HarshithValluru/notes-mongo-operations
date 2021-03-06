//NODE_ENV can be 'production' OR 'development' OR 'test'
//In server.js it will be only either 'production' OR 'test'. Hence we put "|| development"
const env = process.env.NODE_ENV || 'development';
console.log("env === ",env);

if(env === "development" || env === "test"){
    var config = require("./config.json");
    console.log(config);
    var envConfig = config[env];
    Object.keys(envConfig).forEach((key)=>{
        process.env[key] = envConfig[key];
    });
}

// if(env === "development"){
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// }else if(env === "test"){
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }