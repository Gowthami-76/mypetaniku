
const mongoose = require('mongoose');
const Schema = mongoose.Schema

const businessInfoSchema = new Schema({
   
    userId : String,
    legalName: String,
    registerationNum: String,
    postCode : String,
    stateId : String,
    districtId : String,
    town : String,
    address : String,
    status : {type : String , default : "1"},



}, {
    timestamps: true
});

module.exports = mongoose.model('business_info', businessInfoSchema , 'business_info');

