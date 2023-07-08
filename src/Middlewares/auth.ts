import dotenv from 'dotenv';
dotenv.config();
import { Request, Response, NextFunction } from 'express';
import jwt, {Secret} from "jsonwebtoken";
import User from  "../Models/User.js";
import ErrorResponse from "../Utils/errorResponse.js";

declare module 'express' {
  interface Request {
    user?: any; // Replace 'any' with the actual type of the user object
  }
}






export const protect =  async (req: Request,res: Response,next: NextFunction)=>{
    let token ;
 
    if(req.headers.authorization  && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
    }

    if(!token){
      return next(new ErrorResponse(" Not authorized to access this route", 401))
    }
    const jwtSecret: Secret | undefined = process.env.JWT_SECRET;

    
    try {
        if (!jwtSecret) {
            // Handle the case where JWT_SECRET is undefined
            throw new Error('JWT secret is not defined');
          }

        const decoded = jwt.verify(token, jwtSecret); //decode token with secret code
        // const user = await User.findById(decoded.id);
        const user = typeof decoded === 'string' ? await User.findById(decoded) : await User.findById(decoded.id);

        console.log(user)

        if(!user){
            return next(new ErrorResponse(" No user found with this id", 404 ))
        }

        req.user = user;
        next();
        
    } catch (error) {

      return next(new ErrorResponse(" Not authorized to access this route", 401));
        
    }

}