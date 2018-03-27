var mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/TodoApp');

//module.exports.mongoose = mongoose; OR
module.exports = {mongoose};