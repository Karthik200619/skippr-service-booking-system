import exp from 'express'
export const UserApi = exp.Router()
import { hash } from 'bcryptjs'
import UserModel from '../models/UserModel.js';
import { Op } from "sequelize";

UserApi.post("/register", async (req, res) => {
    const { fullName, email, mobile, password, profileImageUrl } = req.body;
    //   check if user exists with the email or mobile
    const existingUser = await UserModel.findOne({
        where: {
            [Op.or]: [{ email }, { mobile }],
        },
    });
    //   if exists dont allow
    if (existingUser) {
        throw new ApiError(409, "User already exists");
    }
    // call register that hashes password and return user without password
    const user = await register(userObj);
    // send response
    res.status(201).json({ message: "Registration successful", payload: { user} });
});

