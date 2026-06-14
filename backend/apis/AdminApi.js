import exp from 'express'
export const AdminApi = exp.Router()

import { verifyToken } from '../middleware/verifyToken.js'

import BlockModel from '../models/BlockModel.js'
import FlatModel from '../models/FlatModel.js'
import BookingModel from '../models/BookingModel.js'
import UserModel from '../models/UserModel.js'
import ServiceModel from '../models/ServiceModel.js'
import SlotModel from '../models/SlotModel.js'

// Create Block
AdminApi.post("/block",verifyToken("ADMIN"),async(req,res)=>{
    const {name,totalFloors,description}=req.body;

    // check if block already exists

    const existingBlock=await BlockModel.findOne({
        where:{name}
    });

    if(existingBlock){
        return res.status(409).json({
            message:"Block already exists"
        });
    }

    // create block
    const block=await BlockModel.create({
        name,
        totalFloors,
        description
    });

    // return response
    res.status(201).json({
        message:"Block created successfully",
        payload:{block}
    });
});


// Get All Blocks
AdminApi.get("/blocks",verifyToken("ADMIN"),async(req,res)=>{
    // get all blocks
    const blocks=await BlockModel.findAll();

    // return response
    res.status(200).json({
        payload:{blocks}
    });
});


// Create Flat
AdminApi.post("/flat",verifyToken("ADMIN"),async(req,res)=>{
    const flatObj=req.body;

    // check if block exists
    const block=await BlockModel.findByPk(flatObj.blockId);

    if(!block){
        throw new Error("Block not found");
    }

    // check duplicate flat in same block
    const existingFlat=await FlatModel.findOne({
        where:{
            blockId:flatObj.blockId,
            flatNumber:flatObj.flatNumber
        }
    });

    if(existingFlat){
        throw new Error("Flat already exists in this block");
    }

    // create flat
    const flat=await FlatModel.create({
        blockId:flatObj.blockId,
        flatNumber:flatObj.flatNumber,
        floor:flatObj.floor,
        parkingSlot:flatObj.parkingSlot,
        bhkType:flatObj.bhkType
    });

    // return response
    res.status(201).json({
        message:"Flat created successfully",
        payload:{flat}
    });
});


// Get All Flats
AdminApi.get("/flats",verifyToken("ADMIN"),async(req,res)=>{
    // get all flats with block details
    const flats=await FlatModel.findAll({
        include:["block"]
    });

    // return response
    res.status(200).json({
        payload:{flats}
    });
});


// Get All Bookings
AdminApi.get("/bookings",verifyToken("ADMIN"),async(req,res)=>{
    const where={};

    // filter bookings by status if provided
    if(req.query.status){
        where.status=req.query.status;
    }

    // get all bookings
    const bookings=await BookingModel.findAll({
        where,
        include:[
            {
                model:UserModel,
                attributes:["id","fullName","email","mobile"]
            },
            {
                model:ServiceModel
            },
            {
                model:SlotModel
            }
        ]
    });

    // return response
    res.status(200).json({
        payload:{bookings}
    });
});


// Approve Booking
AdminApi.patch("/bookings/:bookingId/approve",verifyToken("ADMIN"),async(req,res)=>{
    // get booking by bookingId
    const booking=await BookingModel.findByPk(
        req.params.bookingId
    );

    // check if booking exists
    if(!booking){
        throw new Error("Booking not found");
    }

    // check if already approved
    if(booking.status==="APPROVED"){
        throw new Error("Booking already approved");
    }

    // update booking status
    booking.status="APPROVED";

    // save changes
    await booking.save();

    // return response
    res.status(200).json({
        message:"Booking approved"
    });
});


// Reject Booking
AdminApi.patch("/bookings/:bookingId/reject",verifyToken("ADMIN"),async(req,res)=>{
    // get booking by bookingId
    const booking=await BookingModel.findByPk(
        req.params.bookingId
    );

    // check if booking exists
    if(!booking){
        throw new Error("Booking not found");
    }

    // check if already rejected
    if(booking.status==="REJECTED"){
        throw new Error("Booking already rejected");
    }

    // update booking status
    booking.status="REJECTED";

    // save changes
    await booking.save();

    // return response
    res.status(200).json({
        message:"Booking rejected"
    });
});