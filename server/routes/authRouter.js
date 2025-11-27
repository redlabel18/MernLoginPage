import express from 'express'
import { login, logout, register, sendVerifyOtp, verifyEmail,isAuthenticated, sendResetOtp, resetPasswordOtpVerify } from '../controllers/authController.js';
import userAuth from '../middlewares/userAuth.js';
const authRouter = express.Router();

authRouter.post('/api/register',register)
authRouter.post('/api/login',login)
authRouter.post('/api/logout',logout)
authRouter.post('/send-verify-otp',userAuth,sendVerifyOtp)
authRouter.post('/verify-email',userAuth,verifyEmail)
authRouter.get('/is-auth',userAuth,isAuthenticated)
authRouter.post('/send-reset-otp',sendResetOtp)
authRouter.post('/reset-password',resetPasswordOtpVerify)

export default authRouter;