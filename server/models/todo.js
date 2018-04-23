var mongoose = require('mongoose');

var Todo = mongoose.model("Todo",{      //Will create a collection with all lowercase and puts 's' at end
    text : {                            //Ex: her "Todo" will be created as "todos".
        type : String,
        required : true,
        minlength : 1,
        trim : true
    },
    completed : {
        type : Boolean,
        default : false
    },
    completedAt : {
        type : Number,
        default : null
    },
    _creator : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    }
});
module.exports = {Todo};