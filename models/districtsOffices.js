var mongoose = require('mongoose');

var schema = mongoose.Schema;

var districtsOfficesSchema = new schema({

    disOfficeId : {type :  String},
    disOffice : {type  : String},
    districId : {type : String },
    langId : {type : String }

 
   
})

module.exports = mongoose.model('districtsOffices' , districtsOfficesSchema , 'districtsOffices');