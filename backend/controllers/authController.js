//# AUTH CONTROLLER

import { User } from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";

//^ Generate JWT token for authenticated users
const generateToken = () => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

//# REGISTER USER

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    //^ Prevent duplicate registrations
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    //^ Hash user password before storing
    const salt = await bcrypt.genSalt(10);
    const hashesPassword = await bcrypt.genSalt(password, salt);

    //^ Create new user
    const user = User.create({ name, email, password: hashesPassword });

    if (user) {
      //^ Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      //^ Registration email template
      const message = `
        Welcome to Gadgets-Hub, ${name}
        Your OTP from registration is :"${otp}"`;

      //^ Send OTP email
      await sendEmail(email, `Gadgets-Hub - OTP for registration`, message);

      //^ Return authenticated user response
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error (registerUser)" });
  }
};

//# LOGIN USER

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    //^ Validate user password
    if (user && (await bcrypt.compare(password, user.password))) {
      //^ Return login response with JWT
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Inavalid email or password" });
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Internal Server Error (loginUser)" });
  }
};

//# GET USERS

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error (getUsers)" });
  }
};
