var personal_info = require('../../models/personal_info')
var farmer_info = require('../../models/farm_info')
var business_info = require('../../models/business_info')
var users = require('../../models/user')
var districts = require('../../models/districts')
var districtsOffices = require('../../models/districtsOffices')
var education = require('../../models/education')
var mast_gender = require('../../models/mast_gender')
var owner_ship = require('../../models/owner_ship')
var planting_method = require('../../models/planting_method')
var states = require('../../models/states')
var capital_type = require('../../models/capital_type')
var farming_status = require('../../models/farming_Status')
var farmer_capital = require('../../models/farmer_capital')

var admin = require('../../models/admin')



var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var multer = require('multer');
var mkdirp = require('mkdirp');


var ObjectId = String

var personal_infoObj = Object
var farmer_infoObj = Object

router.post('/admin', (req, res) => {

    admin.findOne({ $and: [{ userId: req.body.userId }, { password: req.body.password }] }, { password: 0 }, (aErr, aRes) => {
        if (aErr) { res.json({ status: 500, message: aErr }) }
        else {
            if (aRes) {
                res.json({ status: 200, message: 'Sucess' })

            } else {
                res.json({ status: 404, message: "Admin Not Found" })
            }
        }
    })

})

router.post('/login', (req, res) => {

    if (req.body.phoneNumber != "" && req.body.phoneNumber != null && req.body.deviceToken != "" && req.body.deviceToken != null) {

        users.findOne({ phoneNumber: req.body.phoneNumber }, (userErr, userRes) => {
            if (userErr) { res.json({ status: 500, message: userErr }) }
            else {
                if (userRes) {

                    users.updateOne({ phoneNumber: req.body.phoneNumber }, { $set: { deviceToken: req.body.deviceToken } }, (upErr, upRes) => {
                        if (upErr) { res.json({ status: 500, message: upErr }) }
                        else {
                            res.json({
                                status: 200, message: "User logged Sucessfully", result: {
                                    userPhoneNumber: userRes.phoneNumber,
                                    verificationStatus: userRes.verifStatus,
                                    approveStatus: userRes.approveStatus
                                }
                            })
                        }
                    })

                } else {
                    const user = new users(req.body)
                    user.save((saErr, saRes) => {
                        if (saErr) { res.json({ status: 500, message: saErr }) }
                        else {
                            res.json({
                                status: 200, message: 'User Registered Sucessfully',
                                result: {
                                    userPhoneNumber: saRes.phoneNumber,
                                    verificationStatus: saRes.verifStatus,
                                    approveStatus: saRes.approveStatus
                                }
                            })
                        }
                    })
                }
            }
        })

    } else {
        res.json({ status: 400, message: "Some Parameters Missing" })
    }

})


let storage = multer.diskStorage({
    destination: function (req, file, cb) {

        const dir = './public/images/documents';
        mkdirp(dir, err => cb(err, dir))
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + Date.now().toString() + '.png')

    }

});
let upload = multer({ storage });

router.post("/personalinfo", upload.any(), (req, res) => {
    if (req.files.length == 2) {

        users.findOne({ phoneNumber: req.body.userId }, (uErr, uRes) => {
            if (uErr) { res.json({ status: 500, message: uErr }) }
            else {
                if (uRes) {
                    let temp = []
                    req.files.forEach(file => {

                        if (file.fieldname == "profilePic") {

                            $: file = { profilePic: file.filename }

                            temp.push(file)
                        }
                        if (file.fieldname == "eSignature") {

                            $: file = { eSignature: file.filename }

                            temp.push(file)
                        }
                    });
                    const profilePic = temp[0]
                    const eSignature = temp[1]

                    personal_infoObj = { ...req.body, ...profilePic, ...eSignature }



                    personal_info.findOne({ userId: req.body.userId }, (prErr, prRes) => {
                        if (prErr) { res.json({ status: 500, message: prErr }) }
                        else {
                            if (prRes) {

                                personal_info.updateMany({ userId: req.body.userId }, { $set: personal_infoObj }, (prUpErr, prUpRes) => {
                                    if (prUpErr) { res.json({ status: 500, message: prUpErr }) }
                                    else {
                                        console.log("prUpRes", prUpRes)
                                        if (prUpRes.nModified == 1) {
                                            res.json({ status: 200, message: "Personal Information Updated SucessFully" })
                                        } else {
                                            res.json({ status: 400, message: "Personal Information  Not Updated" })
                                        }
                                    }
                                })

                            } else {

                                const pr = new personal_info(personal_infoObj);

                                pr.save((saErr, saRes) => {
                                    if (saErr) { res.json({ status: 500, message: saErr }) }
                                    else {

                                        users.updateOne({ phoneNumber: req.body.userId }, { $set: { verifStatus: "1" } }, (upErr, upRes) => {
                                            if (upErr) { res.json({ status: 500, message: upErr }) }
                                            else {
                                                res.json({ status: 200, message: "Success" })

                                            }
                                        })

                                    }
                                })

                            }
                        }
                    })




                } else {
                    res.json({ status: 400, message: "Invaild UserId" })

                }

            }
        })



    } else {
        res.json({ status: 400, message: "ProfilePic and eSignature required Or You Uplaod more than  2 files" })

    }


})


router.post("/farmerinfo", upload.any(), (req, res) => {


    if (req.files.length >= 2) {

        users.findOne({ phoneNumber: req.body.userId }, (uErr, uRes) => {
            if (uErr) { res.json({ status: 500, message: uErr }) }
            else {
                if (uRes) {
                    let temp = []
                    let certfi = []
                    req.files.forEach(file => {

                        console.log('file', file)
                        if (file.fieldname == "farmPhoto") {

                            $: file = { farmPhoto: file.filename }

                            temp.push(file)
                        }
                        if (file.fieldname == "certificates") {

                            console.log('file', file.fieldname)

                            $: file = { certificate: file.filename }

                            certfi.push(file)
                        }
                    });

                    const farmPhoto = temp[0]
                    const certificates = certfi
           
                    farmer_infoObj = { ...req.body, ...farmPhoto, certificates }

                    farmer_info.findOne({ userId: req.body.userId }, (prErr, prRes) => {
                        if (prErr) { res.json({ status: 500, message: prErr }) }
                        else {
                            if (prRes) {

                                farmer_info.updateMany({ userId: req.body.userId }, { $set: farmer_infoObj }, (prUpErr, prUpRes) => {
                                    if (prUpErr) { res.json({ status: 500, message: prUpErr }) }
                                    else {
                                        console.log("prUpRes", prUpRes)
                                        if (prUpRes.nModified == 1) {
                                            res.json({ status: 200, message: "Farmer Information Updated SucessFully" })
                                            res.send(req.files)
                                        } else {
                                            res.json({ status: 400, message: "Farmer Information Not Updated" })
                                        }
                                    }
                                })

                            } else {

                                const pr = new farmer_info(farmer_infoObj);

                                pr.save((saErr, saRes) => {
                                    if (saErr) { res.json({ status: 500, message: saErr }) }
                                    else {

                                        users.updateOne({ phoneNumber: req.body.userId }, { $set: { verifStatus: "3" } }, (upErr, upRes) => {
                                            if (upErr) { res.json({ status: 500, message: upErr }) }
                                            else {
                                                res.json({ status: 200, message: " Farmer Information Submited Sucessfully" })

                                            }
                                        })

                                    }
                                })

                            }
                        }
                    })

                } else {
                    res.json({ status: 400, message: "Invaild UserId" })

                }

            }
        })



    } else {
        res.json({ status: 400, message: "farmerPhoto and Certificates required" })

    }


})


router.post('/businessinfo', (req, res) => {


    users.findOne({ phoneNumber: req.body.userId }, (uErr, uRes) => {
        if (uErr) { res.json({ status: 500, message: uErr }) }
        else {
            if (uRes) {

                business_info.findOne({ userId: req.body.userId }, (bsErr, bsRes) => {
                    if (bsErr) { res.json({ status: 500, message: bsErr }) }
                    else {
                        if (bsRes) {


                            business_info.updateMany({ userId: req.body.userId }, { $set: req.body }, (bsUpErr, bsUpRes) => {
                                if (bsUpErr) { res.json({ status: 500, message: bsUpErr }) }
                                else {
                                    res.json({ status: 200, message: " business information Updated SucessFully" })
                                }

                            })

                        } else {

                            const bussiness = new business_info(req.body);
                            bussiness.save((saErr, saRes) => {
                                if (saErr) { res.json({ status: 500, message: saErr }) }
                                else {
                                    users.updateOne({ phoneNumber: req.body.userId }, { $set: { verifStatus: "2" } }, (upErr, upRes) => {
                                        if (upErr) { res.json({ status: 500, message: upErr }) }
                                        else {
                                            res.json({ status: 200, message: "business information Submited Sucessfully" })
                                        }
                                    })
                                }
                            })

                        }
                    }
                })




            } else {
                res.json({ status: 404, message: "User Not Found" })
            }
        }
    })

})


router.post('/master', (req, res) => {
    // if(!req.body.langId){


    districts.find({ langId: "1" }, { _id: 0, langId: 0 }, (diErr, diRes) => {
        if (diErr) { res.json({ status: 500, message: diErr }) }
        else {
            districtsOffices.find({ langId: "1" }, { _id: 0, langId: 0 }, (disErr, disRes) => {
                if (disErr) { res.json({ status: 500, message: disErr }) }
                else {
                    education.find({ langId: "1" }, { _id: 0, langId: 0 }, (edErr, edRes) => {
                        if (edErr) { res.json({ status: 500, message: edErr }) }
                        else {
                            mast_gender.find({ langId: "1" }, { _id: 0, langId: 0 }, (geErr, geRes) => {
                                if (geErr) { res.json({ status: 500, message: geErr }) }
                                else {
                                    owner_ship.find({ langId: "1" }, { _id: 0, langId: 0 }, (owErr, owRes) => {
                                        if (owErr) { res.json({ status: 500, message: owErr }) }
                                        else {
                                            planting_method.find({ langId: "1" }, { _id: 0, langId: 0 }, (plErr, plRes) => {
                                                if (plErr) { res.json({ status: 500, message: plErr }) }
                                                else {
                                                    states.find({ langId: "1" }, { _id: 0, langId: 0 }, (stErr, stRes) => {
                                                        if (stErr) { res.json({ status: 500, message: stErr }) }
                                                        else {
                                                            capital_type.find({ langId: "1" }, { _id: 0, langId: 0 }, (capErr, capRes) => {
                                                                if (capErr) { res.json({ status: 500, message: capErr }) }
                                                                else {

                                                                    farming_status.find({ langId: "1" }, { _id: 0, langId: 0 }, (farStatusErr, farStatusRes) => {
                                                                        if (farStatusErr) { res.json({ status: 500, message: farStatusErr }) }
                                                                        else {
                                                                            farmer_capital.find({ langId: "1" }, { _id: 0, langId: 0 }, (farCapitalErr, farCapitalRes) => {
                                                                                if (farCapitalErr) { res.json({ status: 500, message: farCapitalErr }) }
                                                                                else {

                                                                                    res.json({
                                                                                        status: 200,
                                                                                        message: "Sucess",
                                                                                        response: {
                                                                                            states: stRes,
                                                                                            districts: diRes,
                                                                                            districtsOffices: disRes,
                                                                                            education: edRes,
                                                                                            gender: geRes,
                                                                                            ownerShip: owRes,
                                                                                            plantingMethod: plRes,
                                                                                            capitalType: capRes,
                                                                                            farmerCapital : farCapitalRes,
                                                                                            farmingStaus : farStatusRes
                                                                                        }
                                                                                    })
                                                                                }
                                                                            })



                                                                        }
                                                                    })




                                                                }
                                                            })


                                                        }
                                                    })

                                                }
                                            })

                                        }
                                    })

                                }
                            })

                        }
                    })

                }
            })


        }
    })



    // }else{
    //     res.json({status : 400 , message : "langId Required"})
    // }
})

router.get('/farmers', (req, res) => {

    farmersInfo(req, res, 1);

})

router.post('/dist/faramers', (req, res) => {

    farmersInfo(req, res, 2);


})

function farmersInfo(req, res, type) {

    if (type == 1) {
        var matchQuery = { "status": "1" }
    } else {
        var matchQuery = { "districtId": req.body.districtId }

    }

    farmer_info.aggregate([
        { $match: matchQuery },
        {
            $project: {
                "certificates": 1,
                "status": 1,
                "foundedYear": 1,
                "captialTypeId": 1,
                "landArea": 1,
                "landUsage": 1,
                "ownerShipId": 1,
                "plantingId": 1,
                "cropDetailId": 1,
                "machinery": 1,
                "town": 1,
                "postCode": 1,
                "stateId": 1,
                "districtId": 1,
                "userId": 1,
                "farmCaptialId"  : 1,
                "farmingStatusId" : 1,
                "approveStatus": 1

            }
        },
        {
            $lookup: {
                "from": "capital_type",
                "localField": "captialTypeId",
                "foreignField": "capTypeId",
                "as": "capital"
            },

        },
        {
            $lookup: {
                "from": "districts",
                "localField": "districtId",
                "foreignField": "distId",
                "as": "district"
            },

        },
        {
            $lookup: {
                "from": "owner_ship",
                "localField": "ownerShipId",
                "foreignField": "ownerShipId",
                "as": "ownerShip"
            },

        },
        {
            $lookup: {
                "from": "planting_method",
                "localField": "plantingId",
                "foreignField": "plantingId",
                "as": "plantingMethod"
            },

        },
        {
            $lookup: {
                "from": "farmer_capital",
                "localField": "farmCaptialId",
                "foreignField": "id",
                "as": "farmerCapital"
            },

        },
        {
            $lookup: {
                "from": "farming_status",
                "localField": "farmingStatusId",
                "foreignField": "id",
                "as": "farmingStatus"
            },

        },
        {
            $lookup: {
                "from": "states",
                "localField": "stateId",
                "foreignField": "stateId",
                "as": "state"
            },

        },
        {
            $lookup: {
                "from": "personal_info",
                "localField": "userId",
                "foreignField": "userId",
                "as": "personalInfo"
            },

        },
        {
            $lookup: {
                "from": "users",
                "localField": "userId",
                "foreignField": "phoneNumber",
                "as": "userApproveInfo"
            },

        },
        { $unwind: { "path": "$capital", preserveNullAndEmptyArrays: true } },
        { $unwind: { "path": "$ownerShip", preserveNullAndEmptyArrays: true } },
        { $unwind: { "path": "$plantingMethod", preserveNullAndEmptyArrays: true } },
        { $unwind: { "path": "$state", preserveNullAndEmptyArrays: true } },
        { $unwind: { "path": "$district", preserveNullAndEmptyArrays: true } },
        { $unwind: { "path": "$userApproveInfo", preserveNullAndEmptyArrays: true } },
        { $unwind: { "path": "$personalInfo", preserveNullAndEmptyArrays: true } },
        { $unwind: { "path": "$farmerCapital", preserveNullAndEmptyArrays: true } },
        { $unwind: { "path": "$farmingStatus", preserveNullAndEmptyArrays: true } },




        {
            $project: {
                "certificates": 1,
                "status": 1,
                "foundedYear": 1,
                "capital": 1,
                "landArea": 1,
                "landUsage": 1,
                "ownerShip": 1,
                "plantingMethod": 1,
                "cropDetailId": 1,
                "machinery": 1,
                "town": 1,
                "postCode": 1,
                "state": 1,
                "district": 1,
                "userId": 1,
                "farmerCapital" : 1,
                "farmingStatus" : 1,
                // "personalInfo" : 1,
                "userApproveInfo.approveStatus": 1

            }
        }

    ], (faErr, faRes) => {
        if (faErr) { res.json({ status: 500, message: faErr }) }
        else {
            res.json({ status: 200, baseUrl: "http://3.94.9.33:5000/images/documents/", result: faRes })

        }

    })
}

router.post('/user/profile', (req, res) => {


    farmer_info.aggregate([
        { $match: { "userId": req.body.userId } },
        {
            $project: {
                "certificates": 1,
                "status": 1,
                "foundedYear": 1,
                "captialTypeId": 1,
                "landArea": 1,
                "landUsage": 1,
                "ownerShipId": 1,
                "plantingId": 1,
                "cropDetailId": 1,
                "machinery": 1,
                "town": 1,
                "postCode": 1,
                "stateId": 1,
                "districtId": 1,
                "farmCaptialId"  : 1,
                "farmingStatusId" : 1,
                "userId": 1,
            }
        },
        {
            $lookup: {
                "from": "capital_type",
                "localField": "captialTypeId",
                "foreignField": "capTypeId",
                "as": "capital"
            },

        },
        {
            $lookup: {
                "from": "districts",
                "localField": "districtId",
                "foreignField": "distId",
                "as": "district"
            },

        },
        {
            $lookup: {
                "from": "owner_ship",
                "localField": "ownerShipId",
                "foreignField": "ownerShipId",
                "as": "ownerShip"
            },

        },
        {
            $lookup: {
                "from": "planting_method",
                "localField": "plantingId",
                "foreignField": "plantingId",
                "as": "plantingMethod"
            },

        },
        {
            $lookup: {
                "from": "farmer_capital",
                "localField": "farmCaptialId",
                "foreignField": "id",
                "as": "farmerCapital"
            },

        },
        {
            $lookup: {
                "from": "farming_status",
                "localField": "farmingStatusId",
                "foreignField": "id",
                "as": "farmingStatus"
            },

        },
        {
            $lookup: {
                "from": "states",
                "localField": "stateId",
                "foreignField": "stateId",
                "as": "state"
            },

        },
        {
            $lookup: {
                "from": "personal_info",
                "localField": "userId",
                "foreignField": "userId",
                "as": "personalInfo"
            },

        },
        {
            $lookup: {
                "from": "users",
                "localField": "userId",
                "foreignField": "phoneNumber",
                "as": "userApproveInfo"
            },

        },
        
        { $unwind: { "path": "$capital", preserveNullAndEmptyArrays: true } },
        { $unwind: { "path": "$ownerShip", preserveNullAndEmptyArrays: true } },
        { $unwind: { "path": "$plantingMethod", preserveNullAndEmptyArrays: true } },
        { $unwind: { "path": "$state", preserveNullAndEmptyArrays: true } },
        { $unwind: { "path": "$district", preserveNullAndEmptyArrays: true } },
        { $unwind: { "path": "$userApproveInfo", preserveNullAndEmptyArrays: true } },
        { $unwind: { "path": "$farmerCapital", preserveNullAndEmptyArrays: true } },
        { $unwind: { "path": "$farmingStatus", preserveNullAndEmptyArrays: true } },



        //   { $unwind: { "path": "$personalInfo", preserveNullAndEmptyArrays: true } },



        {
            $project: {
                "certificates": 1,
                "status": 1,
                "foundedYear": 1,
                "capital": 1,
                "landArea": 1,
                "landUsage": 1,
                "ownerShip": 1,
                "plantingMethod": 1,
                "cropDetailId": 1,
                "machinery": 1,
                "town": 1,
                "postCode": 1,
                "state": 1,
                "district": 1,
                "farmerCapital" : 1,
                "farmingStatus" : 1,
                "userId": 1,
                // "personalInfo" : 1,
                "userApproveInfo.approveStatus": 1
            }
        }

    ], (faErr, faRes) => {
        if (faErr) { res.json({ status: 500, message: faErr }) }
        else {


            personal_info.aggregate([
                { $match: { "userId": req.body.userId } },
                {
                    $project: {
                        "icPassportNo": 1,
                        "phoneNo": 1,
                        "email": 1,
                        "educationId": 1,
                        "occupation": 1,
                        "town": 1,
                        "postCode": 1,
                        "stateId": 1,
                        "districtId": 1,
                        "profilePic": 1,
                        "eSignature": 1,
                        "genderId": 1,
                        "userId": 1,
                        "name": 1
                    }
                },
                {
                    $lookup: {
                        "from": "education",
                        "localField": "educationId",
                        "foreignField": "edId",
                        "as": "education"
                    },

                },
                {
                    $lookup: {
                        "from": "districts",
                        "localField": "districtId",
                        "foreignField": "distId",
                        "as": "district"
                    },

                },
                {
                    $lookup: {
                        "from": "mast_gender",
                        "localField": "genderId",
                        "foreignField": "id",
                        "as": "gender"
                    },

                },

                {
                    $lookup: {
                        "from": "states",
                        "localField": "stateId",
                        "foreignField": "stateId",
                        "as": "state"
                    },

                },

                { $unwind: { "path": "$gender", preserveNullAndEmptyArrays: true } },
                { $unwind: { "path": "$education", preserveNullAndEmptyArrays: true } },
                { $unwind: { "path": "$state", preserveNullAndEmptyArrays: true } },
                { $unwind: { "path": "$district", preserveNullAndEmptyArrays: true } },



                {
                    $project: {
                        "icPassportNo": 1,
                        "phoneNo": 1,
                        "email": 1,
                        "education": 1,
                        "occupation": 1,
                        "town": 1,
                        "postCode": 1,
                        "state": 1,
                        "district": 1,
                        "profilePic": 1,
                        "eSignature": 1,
                        "gender": 1,
                        "userId": 1,
                        "name": 1
                    }
                }

            ], (persErr, persRes) => {


                business_info.aggregate([
                    { $match: { "userId": req.body.userId } },
                    {
                        $project: {
                            "legalName": 1,
                            "postCode": 1,
                            "registerationNum": 1,
                            "town": 1,
                            "userId": 1,
                            "stateId": 1,
                            "districtId": 1
                        }
                    },

                    {
                        $lookup: {
                            "from": "districts",
                            "localField": "districtId",
                            "foreignField": "distId",
                            "as": "district"
                        },

                    },


                    {
                        $lookup: {
                            "from": "states",
                            "localField": "stateId",
                            "foreignField": "stateId",
                            "as": "state"
                        },

                    },


                    { $unwind: { "path": "$state", preserveNullAndEmptyArrays: true } },
                    { $unwind: { "path": "$district", preserveNullAndEmptyArrays: true } },



                    {
                        $project: {
                            "legalName": 1,
                            "postCode": 1,
                            "registerationNum": 1,
                            "town": 1,
                            "userId": 1,
                            "state": 1,
                            "district": 1
                        }
                    }

                ], (bussErr, busRes) => {

                    res.json({
                        status: 200, baseUrl: "http://3.94.9.33:5000/images/documents/", result:


                        {
                            farmerInfo: faRes,
                            personalInfo: persRes,
                            businessInfo: busRes


                        }


                    })

                })

            })




        }

    })



})


router.post('/user/approve', (req, res) => {

    try {
        const { userId, approveStatus } = req.body

        users.updateOne({ phoneNumber: userId }, { approveStatus: approveStatus }, (err, upRes) => {
            if (err) { res.json({ status: 500, message: err.message }) }
            else {
                if (upRes.nModified == 1) {
                    res.json({ status: 200, message: "Approve Status Updated SucessFully" })
                } else {
                    res.json({ status: 401, message: "Update Faild" })
                }
            }
        })


    } catch (error) {
        return {
            status: 500, message: error.message
        }
    }


})


module.exports = router






