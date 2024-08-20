
const mongoose = require('mongoose');
const Schema = mongoose.Schema

const personalInfoSchema = new Schema({
   
    userId : String,
    name: String,
    icPassportNo: String,
    genderId : String,
    phoneNo: String,
    email: String,
    educationId: String,
    occupation: String,
    profilePic: String,
    eSignature: String,
    postCode : String,
    stateId : String,
    districtId : String,
    town : String,
    address : String,
    status : {type : String , default : "1"},



}, {
    timestamps: true
});

module.exports = mongoose.model('personal_info', personalInfoSchema , 'personal_info');

