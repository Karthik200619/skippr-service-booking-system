import exp from "express";
import { authLogin } from "../service/authService.js";

export const CommonApi = exp.Router();

CommonApi.post("/login", async (req, res) => {
    // get the login Obj
    const loginObj = req.body;
    // authenticate the login Obj
    const { user, token } = await authLogin(loginObj);
    // if the credentails match then save token as httpOnly Cookie
    res.cookie("token",token,{
        sameSite:'lax',
        secure:false,
        httpOnly: true,
    })
    // send response
    res.status(200).json({message: "Login successful",payload: { user }});
});