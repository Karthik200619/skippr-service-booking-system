import exp from 'express'
export const UserApi = exp.Router()
import {hash} from 'bcryptjs'
import UserModel from '../models/UserModel.js';
import { Op } from "sequelize";

UserApi.post("/register", async (req, res) => {
  const { fullName, email, mobile, password, profileImageUrl } = req.body;

  const existingUser = await UserModel.findOne({
    where: {
      [Op.or]: [{ email }, { mobile }],
    },
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const passwordHash = await hash(password, 10);

  const user = await UserModel.create({
    fullName,
    email,
    mobile,
    passwordHash,
    profileImageUrl,
  });
  const plainUser = user.toJSON();
  delete plainUser.passwordHash;

  res.status(201).json({message: "Registration successful",payload: {user: plainUser}});
});