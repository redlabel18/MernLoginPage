import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";
import {EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE} from '../config/emailTemplate.js'

//REGISTER FUNCTION
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json({ success: false, message: "Fill all details" });
  }
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exist" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    //--Sending welcome message
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to Redlabel page",
      text: `Aankho me teri Ajab si Gajab si Adaaye hai, Dil ko bata de ${email}`,
    };
    await transporter.sendMail(mailOptions);
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//LOGIN FUNCTION
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ success: false, message: "Invalid email or password" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid email or password" });
    }
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.json({ success: false, message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: "Invalid email or password" });
  }
};

//LOGOUT FUNCTION
export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Logout Succesfuly" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// SEND VERIFICATION OTP TO USER'S EMAIL
export const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);
    if (user.isAccountVerified) {
      return res.json({ success: false, message: "User is already verified" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpiredAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account verification OTP",
      text: `Bhosdike ye Otp copy paste kar ${otp}`,
      html:EMAIL_VERIFY_TEMPLATE,
    };
    await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: "OTP send on your email" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// VERIFY EMAIL WITH OTP
export const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const userId = req.userId;

  if (!userId || !otp) {
    return res.json({ success: false, message: "Missing details" });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Correct OTP validation
    if (
      otp !== user.verifyOtp ||             // Compare as STRING
      user.verifyOtpExpiredAt < Date.now()  // OTP expired
    ) {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    // Mark verified
    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpiredAt = 0;
    await user.save();

    return res.json({
      success: true,
      message: "Account verified successfully!",
    });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


//CHECK IF USER IS AUTHENTICATED
export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true, message: "User is Authenticated" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//SEND PASSWORD RESET OTP
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.json({ success: false, message: "Email is Required" });

  try {
    const user = await userModel.findOne({ email });
    if (!user)
      return res.json({ success: false, message: "User is not Available" });
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpiredAt = Date.now() + 15 * 60 * 1000;
    await user.save();
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Reset Password OTP",
      text: `Bhosdike Password yaad rakha karna lvde, mc is baar tera password reset kar raha hu, Apna password kahi pe likh ke rakh mc, Abhi ye OTP  le ${otp} aur apni gaand me paste kar fir tera password reset karta hu mai`,
      html:PASSWORD_RESET_TEMPLATE,
    };
    await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: "OTP send on your email" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//VERIFY THE RESET PASSWORD OTP
export const resetPasswordOtpVerify = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword)
    return res.json({ success: false, message: "Missing details" });
  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });
    if (
      user.resetOtp === "" ||
      user.resetOtp !== otp ||
      user.resetOtpExpiredAt < Date.now()
    ) {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    if(newPassword === '')return res.json({success:false,message:"New Password is Required"})
    const hashedNewPassword =await bcrypt.hash(newPassword, 10);
  user.password=hashedNewPassword;
  user.resetOtp='';
  user.resetOtpExpiredAt=0;
  await user.save();
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "New Password is set",
      text: `Bhosdike agli baar Password mat bhulna`,
    };
    await transporter.sendMail(mailOptions);
  return res.json({success:true,message:"Password is reset"})

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
