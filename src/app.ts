import dotenv from 'dotenv';
dotenv.config();
import express, {Express, Request, Response} from "express";
import cors from "cors";
import { rateLimit } from 'express-rate-limit';


import connectDB from "./config/ds";
import authRoute from "./Routes/Auth";
import urlRoute from "./Routes/Url";

const app : Express = express();
const PORT = process.env.PORT || 3000;

//Connect Database
connectDB();
// Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})



app.use(cors());
app.use(limiter);
//Routes 
app.use("/auth", authRoute);
app.use("/user", urlRoute);

//Home route

app.get("/", (req: Request,res : Response)=>{
    res.send("Welcome to shortlyurl App");
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})