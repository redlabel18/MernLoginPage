import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongo.js';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';

const app = express();
const port = process.env.PORT || 4000;


const allowedOrigin =['https://mernloginpage-client.onrender.com']
//---Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({origin:allowedOrigin,credentials:true}));

//---Routes
app.use('/auth',authRouter);
app.use('/user',userRouter);

//---connection--
app.listen(port,()=>console.log('Server connected on port',port));
connectDB();

