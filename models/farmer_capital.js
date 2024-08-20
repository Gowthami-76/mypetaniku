var mongoose = require('mongoose');

var schema = mongoose.Schema;

var farmer_capital_Schema = new schema({
    id : {type :  String},
    farmerCapital : {type  : String},
    langId : {type : String }
})

module.exports = mongoose.model('farmer_capital' , farmer_capital_Schema , 'farmer_capital');