var mongoose = require('mongoose');

var schema = mongoose.Schema;

var userSchema = new schema({

   phoneNumber : {type :  String},
   deviceToken : {type  : String},
   verifStatus : {type : String , default : 0},
   langId : {type : String , default : ""},
   approveStatus : {type : String , default:0}
   
} , {
    timestamps : true
})

module.exports = mongoose.model('users' , userSchema , 'users');