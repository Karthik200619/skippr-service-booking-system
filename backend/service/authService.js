import { hash, compare } from "bcryptjs";
import  UserModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config()

export const register = async (userObj) => {
    // hash the password
    userObj.passwordHash = await hash(userObj.password, 10);
    // delete the plain password
    delete userObj.password;
    // save to DB
    const createdUser = await UserModel.create(userObj);
    // convert the user to JavaScript Object
    const user = createdUser.toJSON();
    // delete password from user Object 
    delete user.passwordHash;
    //  return the user Object
    return user;
};


export const authLogin = async (loginObj) => {
    const user = await UserModel.findOne({
        where: { email: loginObj.email }
    });
    // check if valid email
    if (!user) {
        const err = new Error("User with email not found");
        err.status = 404;
        throw err;
    }
    // if valid email then compare password
    const isValidPass = await compare(
        loginObj.password,
        user.passwordHash
    );
    
    // check is valid password
    if (!isValidPass) {
        const err = new Error("Password mismatch");
        err.status = 401;
        throw err;
    }
    // check if user is verified
    if (!user.isVerified) {
        const err = new Error("Account not verified. Please verify your email first.");
        err.status = 403;
        throw err;
    }
    // check if user is approved by admin
    if (user.role !== "ADMIN" && user.approvalStatus !== "APPROVED") {
        if (user.approvalStatus === "REJECTED") {
            const err = new Error("Your registration request was rejected by admin.");
            err.status = 403;
            throw err;
        } else {
            const err = new Error("Your account is pending admin approval.");
            err.status = 403;
            throw err;
        }
    }
    // check is user is not blocked
    if (!user.isActive) {
        const err = new Error("Account blocked");
        err.status = 403;
        throw err;
    }

    // if all okay
    // generate token using JWT [ JSON Web Token ]
    const token = jwt.sign(
        {
            userId: user.id,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
    const userObj = user.toJSON();
    delete userObj.passwordHash;
    return { user: userObj, token };
};