var mongoose = require('mongoose');

var schema = mongoose.Schema;

var owner_shipSchema = new schema({

    ownerShipId : {type :  String},
    ownerShip : {type  : String},
    langId : {type : String }
 
   
})

module.exports = mongoose.model('owner_ship' , owner_shipSchema , 'owner_ship');