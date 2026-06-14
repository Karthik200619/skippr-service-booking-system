import exp from 'express'
export const UserApi = exp.Router()
import { hash } from 'bcryptjs'
import UserModel from '../models/UserModel.js';
import { Op } from "sequelize";
import { upload } from '../config/multer.js';
import { verifyToken } from '../middleware/verifyToken.js';


UserApi.post("/register", upload.single("profileImage"), async (req, res) => {
    const { fullName, email, mobile, password } = req.body;

    // check if user exists with email or mobile
    const existingUser = await UserModel.findOne({
        where: {
            [Op.or]: [
                { email },
                { mobile }
            ]
        }
    });

    // if exists don't allow registration
    if (existingUser) {
        throw new ApiError(409, "User already exists");
    }

    let profileImageUrl = null;

    // upload profile image to cloudinary if provided
    if (req.file) {
        const result = await uploadToCloudinary(
            req.file.buffer
        );

        profileImageUrl = result.secure_url;
    }

    // create user object
    const userObj = {
        fullName,
        email,
        mobile,
        password,
        profileImageUrl
    };

    // call register service
    const user = await register(userObj);

    // send response
    res.status(201).json({
        message: "Registration successful",
        payload: { user }
    });
});

// Get All active services
UserApi.get("/services", verifyToken("CUSTOMER", "ADMIN"), async (req, res) => {
    // get all the active services 
    const services = await ServiceModel.findAll({
        where: { isActive: true }
    });

    res.status(200).json({ payload: { services } });
}
);

// Booking Service
UserApi.post("/book-service", verifyToken("CUSTOMER"), async (req, res) => {
    const { serviceId, slotId, bookingDate, notes } = req.body;

    const existingBooking = await BookingModel.findOne({
        where: {
            userId: req.user.userId,
            serviceId,
            slotId,
            bookingDate
        }
    });

    if (existingBooking) {
        throw new Error(
            "You already booked this service for this slot"
        );
    }

    const booking = await BookingModel.create({
        userId: req.user.userId,
        serviceId,
        slotId,
        bookingDate,
        notes
    });

    res.status(201).json({ message: "Booking created successfully", payload: { booking } });
});

// Booking of current user 
UserApi.get("/my-bookings", verifyToken("CUSTOMER"), async (req, res) => {
    const bookings = await BookingModel.findAll({
        where: { userId: req.user.userId },
        include: [
            ServiceModel,
            SlotModel
        ]
    });

    res.status(200).json({ payload: { bookings } });
});

UserApi.get("/service-slots", verifyToken("CUSTOMER", "ADMIN"), async (req, res) => {
    const { serviceId, bookingDate } = req.query;

    const slots = await SlotModel.findAll();

    const result = [];

    for (const slot of slots) {

        const booking = await BookingModel.findOne({
            where: {
                serviceId,
                slotId: slot.id,
                bookingDate
            }
        });

        result.push({
            slotId: slot.id,
            startTime: slot.startTime,
            endTime: slot.endTime,
            status: booking
                ? booking.status
                : "AVAILABLE"
        });
    }

    res.status(200).json({ payload: { slots: result } });
});