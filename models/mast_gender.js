var mongoose = require('mongoose');

var schema = mongoose.Schema;

var mast_genderSchema = new schema({

    id : {type :  String},
    sex : {type  : String},
    langId : {type : String }
 
   
})

module.exports = mongoose.model('mast_gender' , mast_genderSchema , 'mast_gender');