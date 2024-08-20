var mongoose = require('mongoose');

var schema = mongoose.Schema;

var capital_typeSchema = new schema({

    capTypeId : {type :  String},
    capitalType : {type  : String},
    langId : {type : String }
 
   
})

module.exports = mongoose.model('capital_type' , capital_typeSchema , 'capital_type');