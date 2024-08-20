var mongoose = require('mongoose');

var schema = mongoose.Schema;

var adminSchema = new schema({

   userId : {type :  String},
   password : {type  : String},
   langId : {type : String , default : ""}
   
} , {
    timestamps : true
})

module.exports = mongoose.model('admin' , adminSchema , 'admin');