import exp from 'express'
export const UserApi = exp.Router()
import { hash } from 'bcryptjs'
import UserModel from '../models/UserModel.js';
import FlatModel from '../models/FlatModel.js';
import ServiceModel from '../models/ServiceModel.js';
import BookingModel from '../models/BookingModel.js';
import SlotModel from '../models/SlotModel.js';
import OtpModel from '../models/OtpModel.js';
import HelpQueryModel from '../models/HelpQueryModel.js';
import { register } from '../service/authService.js';
import { Op } from "sequelize";
import { upload } from '../config/multer.js';
import { verifyToken } from '../middleware/verifyToken.js';
import generateOTP from '../service/createPassCrypto.js';
import sendemail from '../config/nodemailer.js';
import { sendWhatsAppMessage } from '../service/whatsappService.js';
import cloudinary from '../config/cloudinary.js';

class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

const uploadToCloudinary = async (buffer) => {
    try {
        return await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "skippr_profile_images" },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            uploadStream.end(buffer);
        });
    } catch (err) {
        console.error("Cloudinary upload failed, using Dicebear fallback:", err);
        const randomSeed = Math.random().toString(36).substring(7);
        return {
            secure_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${randomSeed}`
        };
    }
};


UserApi.post("/register", upload.single("profileImage"), async (req, res) => {
    const { fullName, email, mobile, password, occupantType, flatId } = req.body;

    if (!occupantType || !flatId) {
        throw new ApiError(400, "Occupant type and Flat are required");
    }

    const flat = await FlatModel.findByPk(flatId);
    if (!flat) {
        throw new ApiError(404, "Selected flat not found");
    }

    // Check if flat is already registered by another occupant
    const existingOccupant = await UserModel.findOne({
        where: {
            flatId,
            approvalStatus: ["PENDING", "APPROVED"]
        }
    });

    if (existingOccupant) {
        throw new ApiError(409, "This flat is already registered by another occupant.");
    }

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
        profileImageUrl,
        occupantType,
        flatId,
        approvalStatus: "PENDING"
    };

    // call register service
    const user = await register(userObj);

    // Generate OTP
    const otpCode = generateOTP().toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    // Save to OTP table
    await OtpModel.create({
        email: user.email,
        mobile: user.mobile,
        otp: otpCode,
        expiresAt
    });

    // Send email via Brevo config
    const mailMessage = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <h2 style="color: #4F46E5; margin-bottom: 20px;">Welcome to Skippr, ${user.fullName}!</h2>
            <p style="font-size: 16px; line-height: 1.6;">Thank you for registering with us. Please use the following One-Time Password (OTP) to verify your account:</p>
            <div style="background-color: #F5F3FF; padding: 15px; font-size: 28px; font-weight: bold; letter-spacing: 5px; text-align: center; border-radius: 8px; margin: 24px 0; color: #6D28D9; border: 1px dashed #C084FC;">
                ${otpCode}
            </div>
            <p style="font-size: 14px; color: #6B7280;">This OTP is valid for 5 minutes. Please do not share this code with anyone.</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="font-size: 12px; color: #9CA3AF; text-align: center;">Skippr Service Booking System &copy; 2026</p>
        </div>
    `;

    try {
        await sendemail(user.email, "Verify Your Skippr Account - OTP", mailMessage);
    } catch (mailErr) {
        console.error("Failed to send verification email:", mailErr);
    }

    // send response
    res.status(201).json({
        message: "Registration successful. Verification OTP sent to your email.",
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
    const { serviceId, slotId, bookingDate, notes, priority } = req.body;

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
        notes,
        priority: priority || "MEDIUM"
    });

    // Fetch details for WhatsApp and Email notifications
    try {
        const user = await UserModel.findByPk(req.user.userId);
        const service = await ServiceModel.findByPk(serviceId);
        const slot = await SlotModel.findByPk(slotId);

        if (user && service && slot) {
            // Send WhatsApp message
            const message = `Hello ${user.fullName},\n\nYour booking for ${service.name} on ${bookingDate} (${slot.startTime} - ${slot.endTime}) has been received successfully.\n\nStatus: PENDING\n\nWe will notify you once the admin reviews and updates your booking. Thank you for choosing Skippr!`;
            await sendWhatsAppMessage(user.mobile, message);

            // Send Email notification
            const mailMessage = `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    <h2 style="color: #4F46E5; margin-bottom: 20px;">Booking Request Received!</h2>
                    <p style="font-size: 16px; line-height: 1.6;">Hello ${user.fullName},</p>
                    <p style="font-size: 16px; line-height: 1.6;">We have received your booking request for <strong>${service.name}</strong>.</p>
                    
                    <div style="background-color: #F8FAFC; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #E2E8F0;">
                        <p style="margin: 5px 0; font-size: 14px;"><strong>Date:</strong> ${bookingDate}</p>
                        <p style="margin: 5px 0; font-size: 14px;"><strong>Time:</strong> ${slot.startTime} - ${slot.endTime}</p>
                        <p style="margin: 5px 0; font-size: 14px;"><strong>Status:</strong> <span style="color: #D97706; font-weight: bold;">PENDING ADMIN APPROVAL</span></p>
                    </div>

                    <div style="background-color: #ECFDF5; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #A7F3D0;">
                        <p style="margin: 0; font-size: 14px; color: #065F46; line-height: 1.6;">
                            <strong>WhatsApp Updates:</strong> To receive future updates and booking confirmations directly on WhatsApp, please send the message <strong>"join shout-growth"</strong> to <strong>+14155238886</strong>.
                        </p>
                    </div>

                    <p style="font-size: 14px; color: #6B7280; margin-top: 20px;">We will notify you once the admin reviews and updates your booking.</p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #9CA3AF; text-align: center;">Skippr Service Booking System &copy; 2026</p>
                </div>
            `;
            await sendemail(user.email, `Booking Received: ${service.name}`, mailMessage);
        }
    } catch (wsErr) {
        console.error("Failed to send notifications:", wsErr);
    }

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
        const approvedBooking = await BookingModel.findOne({
            where: {
                serviceId,
                slotId: slot.id,
                bookingDate,
                status: "APPROVED"
            }
        });

        if (approvedBooking) {
            result.push({
                slotId: slot.id,
                startTime: slot.startTime,
                endTime: slot.endTime,
                status: "APPROVED"
            });
        } else {
            const pendingBooking = await BookingModel.findOne({
                where: {
                    serviceId,
                    slotId: slot.id,
                    bookingDate,
                    status: "PENDING"
                }
            });

            result.push({
                slotId: slot.id,
                startTime: slot.startTime,
                endTime: slot.endTime,
                status: pendingBooking ? "PENDING" : "AVAILABLE"
            });
        }
    }

    res.status(200).json({ payload: { slots: result } });
});

UserApi.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Find the latest active OTP for this email
    const otpRecord = await OtpModel.findOne({
        where: {
            email,
            otp
        },
        order: [['createdAt', 'DESC']]
    });

    if (!otpRecord) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if expired
    if (new Date() > new Date(otpRecord.expiresAt)) {
        return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Mark user as verified
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    user.isVerified = true;
    await user.save();

    // Delete the OTP record so it cannot be reused
    await otpRecord.destroy();

    res.status(200).json({ message: "Email verified successfully. You can now login." });
});

UserApi.post("/resend-otp", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
        return res.status(400).json({ message: "User is already verified" });
    }

    // Generate new OTP
    const otpCode = generateOTP().toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Save to OTP table
    await OtpModel.create({
        email: user.email,
        mobile: user.mobile,
        otp: otpCode,
        expiresAt
    });

    // Send email
    const mailMessage = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <h2 style="color: #4F46E5; margin-bottom: 20px;">Verify Your Skippr Account - New OTP</h2>
            <p style="font-size: 16px; line-height: 1.6;">Please use the following One-Time Password (OTP) to verify your account:</p>
            <div style="background-color: #F5F3FF; padding: 15px; font-size: 28px; font-weight: bold; letter-spacing: 5px; text-align: center; border-radius: 8px; margin: 24px 0; color: #6D28D9; border: 1px dashed #C084FC;">
                ${otpCode}
            </div>
            <p style="font-size: 14px; color: #6B7280;">This OTP is valid for 5 minutes.</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="font-size: 12px; color: #9CA3AF; text-align: center;">Skippr Service Booking System &copy; 2026</p>
        </div>
    `;

    try {
        await sendemail(user.email, "Verify Your Skippr Account - OTP", mailMessage);
    } catch (mailErr) {
        console.error("Failed to send verification email:", mailErr);
        return res.status(500).json({ message: "Failed to send verification email" });
    }

    res.status(200).json({ message: "A new OTP has been sent to your email." });
});

// Submit a Help Query
UserApi.post("/help-queries", verifyToken("CUSTOMER"), async (req, res) => {
    try {
        const { subject, message } = req.body;
        if (!subject || !message) {
            return res.status(400).json({ message: "Subject and Message are required" });
        }

        const query = await HelpQueryModel.create({
            userId: req.user.userId,
            subject,
            message,
            status: "PENDING"
        });

        res.status(201).json({ message: "Help query submitted successfully", payload: { query } });
    } catch (error) {
        res.status(500).json({ message: "Failed to submit help query", error: error.message });
    }
});