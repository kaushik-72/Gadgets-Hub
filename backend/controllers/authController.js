//# AUTH CONTROLLER

import { User } from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";

//^ Generate JWT token for authenticated users
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

//# REGISTER USER

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });
    if (user) {
      
      // Generate a mock OTP
      const otp = Math.floor(100000 + Math.random() * 900000);
      
      // Send Welcome / OTP Email
      //todo -> name uppercase, email hbs
      const message = `
        <h2>Welcome to Gadgets-Hub, ${name}!</h2>
        <p>Thank you for registering on our platform.</p>
        <p>Your one-time verification/discount OTP is: <strong>${otp}</strong></p>
      `;

      await sendEmail({
        email: user.email,
        subject: 'Welcome to Gadgets-Hub - Your OTP',
        message
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
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
