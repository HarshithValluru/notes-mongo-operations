const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id : 11
};
var token = jwt.sign(data,"123abc");
console.log(token);
console.log("token:",typeof token);

var decoded = jwt.verify(token,"123abc");
console.log(decoded);
console.log("decoded:",typeof decoded);

// var data = {
//     id : 4,
//     name : "Harshith Valluru"
// };

// var hash = SHA256(data).toString();

// var token = {
//     data,
//     hash : SHA256(data).toString()
// };

// var resultHash = SHA256(token.data).toString();
// if(hash === resultHash)
//     console.log("Data is same");
// else
//     console.log("Data is corrupted");