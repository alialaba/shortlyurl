import dotenv from 'dotenv';
dotenv.config();
import express, {Express, Request, Response} from "express";
// import cors from;

import connectDB from "./config/ds";
import authRoute from "./Routes/Auth";

const app : Express = express();
const PORT = process.env.PORT || 3000;

//Connect Database
connectDB();
// Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// app.use(cors());

//Routes 
app.use("/auth", authRoute);

//Home route

app.get("/", (req: Request,res : Response)=>{
    res.send("Welcome to shortlyurl App");
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})