import exp from "express";
import { authLogin } from "../service/authService.js";
import { verifyToken } from '../middleware/verifyToken.js';
import UserModel from "../models/UserModel.js";

export const CommonApi = exp.Router();

CommonApi.post("/login", async (req, res) => {
    // get the login Obj
    const loginObj = req.body;
    // authenticate the login Obj
    const { user, token } = await authLogin(loginObj);
    // if the credentails match then save token as httpOnly Cookie
    res.cookie("token", token, {
        sameSite: 'lax',
        secure: false,
        httpOnly: true,
    })
    // send response
    res.status(200).json({ message: "Login successful", payload: { user } });
});

CommonApi.post("/logout", async (req, res) => {
    // to logout first clear token from cookie storage 
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: false
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