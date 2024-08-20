var mongoose = require('mongoose');

var schema = mongoose.Schema;

var planting_methodSchema = new schema({

    plantingId : {type :  String},
    plantingMethod : {type  : String},
    langId : {type : String }
 
   
})

module.exports = mongoose.model('planting_method' , planting_methodSchema , 'planting_method');