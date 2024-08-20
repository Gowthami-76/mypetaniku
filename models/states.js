var mongoose = require('mongoose');

var schema = mongoose.Schema;

var statesSchema = new schema({

    stateId : {type :  String},
    state : {type  : String},
    langId : {type : String }
 
   
})

module.exports = mongoose.model('states' , statesSchema , 'states');