var mongoose = require('mongoose');

var schema = mongoose.Schema;

var districtsSchema = new schema({

    distId : {type :  String},
    districtName : {type  : String},
    stateId : {type : String },
    langId : {type : String }

 
   
})

module.exports = mongoose.model('districts' , districtsSchema , 'districts');