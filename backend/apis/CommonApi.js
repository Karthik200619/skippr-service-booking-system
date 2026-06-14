import exp from "express";
import { authLogin } from "../service/authService.js";
import { verifyToken } from '../middleware/verifyToken.js';
import UserModel from "../models/UserModel.js";
import BlockModel from "../models/BlockModel.js";
import FlatModel from "../models/FlatModel.js";
import SlotModel from "../models/SlotModel.js";

export const CommonApi = exp.Router();

CommonApi.get("/blocks", async (req, res) => {
    try {
        const blocks = await BlockModel.findAll();
        res.status(200).json({ payload: { blocks } });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch blocks", error: error.message });
    }
});

CommonApi.get("/flats/by-block/:blockId", async (req, res) => {
    try {
        const flats = await FlatModel.findAll({
            where: { blockId: req.params.blockId },
            include: [
                {
                    model: UserModel,
                    as: "residents",
                    required: false,
                    where: {
                        approvalStatus: ["PENDING", "APPROVED"]
                    }
                }
            ]
        });
        // Only return flats that do not have any pending or approved occupants
        const availableFlats = flats.filter(flat => !flat.residents || flat.residents.length === 0);
        res.status(200).json({ payload: { flats: availableFlats } });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch flats", error: error.message });
    }
});

CommonApi.post("/login", async (req, res) => {
    // get the login Obj
    const loginObj = req.body;
    // authenticate the login Obj
    const { user, token } = await authLogin(loginObj);
    // if the credentails match then save token as httpOnly Cookie
    res.cookie("token", token, {
        sameSite: 'none',
        secure: true,
        httpOnly: true,
    })
    // send response
    res.status(200).json({ message: "Login successful", payload: { user } });
});

CommonApi.post("/logout", async (req, res) => {
    // to logout first clear token from cookie storage 
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "none",
        secure: true
    });

    res.status(200).json({ message: "Logout successful" });
});

CommonApi.get("/check-auth",verifyToken("ADMIN", "CUSTOMER"),async(req,res) => {

        const user = await UserModel.findByPk(
            req.user.userId,
            {
                attributes: {
                    exclude: ["passwordHash"]
                }
            }
        );
        res.status(200).json({
            payload: { user }
        });
    }
);

CommonApi.get("/slots", async (req, res) => {
    try {
        const slots = await SlotModel.findAll({ where: { isActive: true } });
        res.status(200).json({ payload: { slots } });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch slots", error: error.message });
    }
});
