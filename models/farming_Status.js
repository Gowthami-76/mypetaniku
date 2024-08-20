var mongoose = require('mongoose');

var schema = mongoose.Schema;

var farming_status_Schema = new schema({
    id : {type :  String},
    farmingStatus : {type  : String},
    langId : {type : String }
})

module.exports = mongoose.model('farming_status' , farming_status_Schema , 'farming_status');