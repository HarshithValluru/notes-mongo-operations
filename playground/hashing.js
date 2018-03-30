const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// var data = {
//     id : 11
// };
// var token = jwt.sign(data,"123abc");
// console.log(token);
// console.log("token:",typeof token);

// var decoded = jwt.verify(token,"123abc");
// console.log(decoded);
// console.log("decoded:",typeof decoded);

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

var pwd = "123qwe";
// bcrypt.genSalt(10,(err,salt)=>{
//     bcrypt.hash(pwd,salt,(err,hash)=>{
//         console.log(hash);
//     })
// });
var hashPwd = "$2a$10$YC8E2j9LSHjzailrC039P.sQ8UAftepE1T3OlCa7J59yNbEMIChN.";
var hashPwd1 = "$2a$10$4lEKt3WqjOiRAo9hudWvmeQrW8g963T1mtI0StMo0nQaEn8yV.m/m";
var hashPwd2 = "$2a$10$OuFSg9PP/FUXUllFebcWxenmQetagh8.8WPl104gwNA2XPmOWrwf2";
bcrypt.compare(pwd,hashPwd,(err,res)=>{
    console.log("hashPwd:",res);
});
bcrypt.compare(pwd,hashPwd1,(err,res)=>{
    console.log("hashPwd1:",res);
});
bcrypt.compare(pwd,hashPwd2,(err,res)=>{
    console.log("hashPwd2:",res);
});

var userHashedPwd = "$2a$10$hjjJdX0Zip4VHlR9dFRHFOyrdDfCuZ3We5FvKxB41SWI5ml2e34LW";
bcrypt.compare("password!",userHashedPwd,(err,res)=>{
    console.log("userHashedPwd",res);
});






