import exp from 'express'
export const AdminApi = exp.Router()

import { verifyToken } from '../middleware/verifyToken.js'
import { Op } from 'sequelize'

import BlockModel from '../models/BlockModel.js'
import FlatModel from '../models/FlatModel.js'
import BookingModel from '../models/BookingModel.js'
import UserModel from '../models/UserModel.js'
import ServiceModel from '../models/ServiceModel.js'
import SlotModel from '../models/SlotModel.js'
import { sendWhatsAppMessage } from '../service/whatsappService.js'
import HelpQueryModel from '../models/HelpQueryModel.js'
import OtpModel from '../models/OtpModel.js'

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
                attributes:["id","fullName","email","mobile","flatId"],
                include:[
                    {
                        model:FlatModel,
                        as:"flat",
                        include:["block"]
                    }
                ]
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

    // Send WhatsApp notification
    try {
        const user = await UserModel.findByPk(booking.userId);
        const service = await ServiceModel.findByPk(booking.serviceId);
        const slot = await SlotModel.findByPk(booking.slotId);

        if (user && service && slot) {
            const message = `Hello ${user.fullName},\n\nYour booking for ${service.name} on ${booking.bookingDate} (${slot.startTime} - ${slot.endTime}) has been APPROVED by the admin.\n\nEnjoy your service!`;
            await sendWhatsAppMessage(user.mobile, message);
        }
    } catch (wsErr) {
        console.error("Failed to send WhatsApp message for approval:", wsErr);
    }

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

    // Send WhatsApp notification
    try {
        const user = await UserModel.findByPk(booking.userId);
        const service = await ServiceModel.findByPk(booking.serviceId);
        const slot = await SlotModel.findByPk(booking.slotId);

        if (user && service && slot) {
            const message = `Hello ${user.fullName},\n\nYour booking for ${service.name} on ${booking.bookingDate} (${slot.startTime} - ${slot.endTime}) has been REJECTED.`;
            await sendWhatsAppMessage(user.mobile, message);
        }
    } catch (wsErr) {
        console.error("Failed to send WhatsApp message for rejection:", wsErr);
    }

    // return response
    res.status(200).json({
        message:"Booking rejected"
    });
});

// Reject All Others for the same slot
AdminApi.patch("/bookings/:bookingId/reject-others", verifyToken("ADMIN"), async(req, res) => {
    const booking = await BookingModel.findByPk(req.params.bookingId);

    if (!booking) {
        throw new Error("Booking not found");
    }

    // Find all other pending bookings for the same service, slot, and date
    const otherPendingBookings = await BookingModel.findAll({
        where: {
            serviceId: booking.serviceId,
            slotId: booking.slotId,
            bookingDate: booking.bookingDate,
            status: "PENDING",
            id: { [Op.ne]: booking.id }
        },
        include: [UserModel, ServiceModel, SlotModel]
    });

    let rejectedCount = 0;
    for (const otherBooking of otherPendingBookings) {
        otherBooking.status = "REJECTED";
        await otherBooking.save();
        rejectedCount++;

        // Send WhatsApp notification
        if (otherBooking.User) {
            const message = `Hello ${otherBooking.User.fullName},\n\nYour booking for ${otherBooking.Service?.name || "service"} on ${otherBooking.bookingDate} (${otherBooking.Slot?.startTime} - ${otherBooking.Slot?.endTime}) has been REJECTED.`;
            try {
                await sendWhatsAppMessage(otherBooking.User.mobile, message);
            } catch (wsErr) {
                console.error(`Failed to send WhatsApp message to ${otherBooking.User.mobile}:`, wsErr);
            }
        }
    }

    res.status(200).json({
        message: `Rejected all other pending bookings (${rejectedCount}) for this slot.`
    });
});

// Get customer users with filter, cursor-based pagination and search
AdminApi.get("/users", verifyToken("ADMIN"), async (req, res) => {
    try {
        const { approvalStatus, name, blockId, flatId, cursor, limit = 10 } = req.query;

        const where = { role: "CUSTOMER" };

        if (approvalStatus && approvalStatus !== "ALL") {
            where.approvalStatus = approvalStatus;
        }

        if (name) {
            where.fullName = { [Op.iLike]: `%${name}%` };
        }

        if (cursor) {
            where.id = { [Op.lt]: parseInt(cursor) };
        }

        const flatWhere = {};
        if (flatId) {
            flatWhere.id = parseInt(flatId);
        }
        if (blockId) {
            flatWhere.blockId = parseInt(blockId);
        }

        const parsedLimit = parseInt(limit);
        const users = await UserModel.findAll({
            where,
            include: [
                {
                    model: FlatModel,
                    as: "flat",
                    where: Object.keys(flatWhere).length > 0 ? flatWhere : undefined,
                    required: !!(flatId || blockId),
                    include: [
                        {
                            model: BlockModel,
                            as: "block"
                        }
                    ]
                }
            ],
            order: [["id", "DESC"]],
            limit: parsedLimit + 1
        });

        let hasNextPage = false;
        let nextCursor = null;

        if (users.length > parsedLimit) {
            hasNextPage = true;
            const popped = users.pop();
            nextCursor = popped.id;
        }

        res.status(200).json({
            payload: {
                users,
                nextCursor,
                hasNextPage
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
});

// Approve User Registration
AdminApi.patch("/users/:userId/approve", verifyToken("ADMIN"), async (req, res) => {
    try {
        const user = await UserModel.findByPk(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.approvalStatus = "APPROVED";
        await user.save();
        res.status(200).json({ message: "User approved successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to approve user", error: error.message });
    }
});

// Reject User Registration (Deletes record from database)
AdminApi.patch("/users/:userId/reject", verifyToken("ADMIN"), async (req, res) => {
    try {
        const user = await UserModel.findByPk(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete any related OTP records
        await OtpModel.destroy({
            where: {
                [Op.or]: [
                    { email: user.email },
                    { mobile: user.mobile }
                ]
            }
        });

        // Delete the user record completely
        await user.destroy();
        res.status(200).json({ message: "User registration rejected and record deleted from database successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to reject user", error: error.message });
    }
});

// Edit User Details
AdminApi.put("/users/:userId", verifyToken("ADMIN"), async (req, res) => {
    try {
        const { fullName, email, mobile, occupantType, flatId } = req.body;
        const userId = req.params.userId;

        const user = await UserModel.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Validate unique email
        if (email && email !== user.email) {
            const emailExists = await UserModel.findOne({ where: { email, id: { [Op.ne]: userId } } });
            if (emailExists) {
                return res.status(409).json({ message: "Email is already in use by another user" });
            }
        }

        // Validate unique mobile
        if (mobile && mobile !== user.mobile) {
            const mobileExists = await UserModel.findOne({ where: { mobile, id: { [Op.ne]: userId } } });
            if (mobileExists) {
                return res.status(409).json({ message: "Mobile number is already in use by another user" });
            }
        }

        // Validate flat occupant assignment
        if (flatId && flatId !== user.flatId) {
            const flat = await FlatModel.findByPk(flatId);
            if (!flat) {
                return res.status(404).json({ message: "Selected flat not found" });
            }

            const existingOccupant = await UserModel.findOne({
                where: {
                    flatId,
                    approvalStatus: ["PENDING", "APPROVED"],
                    id: { [Op.ne]: userId }
                }
            });

            if (existingOccupant) {
                return res.status(409).json({ message: "This flat is already registered by another occupant." });
            }
        }

        // Update fields
        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.mobile = mobile || user.mobile;
        user.occupantType = occupantType || user.occupantType;
        if (flatId) {
            user.flatId = flatId;
        }

        await user.save();
        res.status(200).json({ message: "Resident details updated successfully", payload: { user } });
    } catch (error) {
        res.status(500).json({ message: "Failed to update resident details", error: error.message });
    }
});

// Get all Help Queries
AdminApi.get("/help-queries", verifyToken("ADMIN"), async (req, res) => {
    try {
        const queries = await HelpQueryModel.findAll({
            include: [
                {
                    model: UserModel,
                    as: "user",
                    attributes: ["id", "fullName", "email", "mobile"],
                    include: [
                        {
                            model: FlatModel,
                            as: "flat",
                            include: ["block"]
                        }
                    ]
                }
            ],
            order: [["createdAt", "DESC"]]
        });
        res.status(200).json({ payload: { queries } });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch help queries", error: error.message });
    }
});

// Resolve a Help Query
AdminApi.patch("/help-queries/:queryId/resolve", verifyToken("ADMIN"), async (req, res) => {
    try {
        const query = await HelpQueryModel.findByPk(req.params.queryId);
        if (!query) {
            return res.status(404).json({ message: "Help query not found" });
        }
        query.status = "RESOLVED";
        await query.save();
        res.status(200).json({ message: "Help query resolved successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to resolve help query", error: error.message });
    }
});