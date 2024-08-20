
const mongoose = require('mongoose');
const Schema = mongoose.Schema

const farmer_infoSchema = new Schema({
   
    userId : String,
    farmPhoto: String,
    foundedYear : String,
    captialTypeId : String,
    landArea: String,
    landUsage: String,
    ownerShipId : String,
    certificates : {type : Array},
    plantingId : String,
    cropDetailId  : String,
    machinery : String,
    postCode : String,
    stateId : String,
    districtId : String,
    town : String,
    address : String,
    farmCaptialId : String,
    localWorkers : String,
    foreignersWorkers : String,
    turnOver: String,
    farmingStatusId  : String,
    status : {type : String , default : "1"},




}, {
    timestamps: true
});

module.exports = mongoose.model('farmer_info', farmer_infoSchema , 'farmer_info');

