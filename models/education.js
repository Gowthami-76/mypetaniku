var mongoose = require('mongoose');

var schema = mongoose.Schema;

var educationSchema = new schema({

    edId : {type :  String},
    education : {type  : String},
    langId : {type : String }

 
   
})

module.exports = mongoose.model('education' , educationSchema , 'education');