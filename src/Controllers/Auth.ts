import { Request, Response, NextFunction } from 'express';
import User from "../Models/User";
import ErrorResponse from "../Utils/errorResponse";


export const signup = async (req: Request, res: Response, next: NextFunction)=>{
    const {fullname, email, password} = req.body;

    try {
        const user = await User.create({fullname, email, password})

        sendToken(user, 201, res)
        
    } catch (error) {
        next(error)
    }

}

export const login = async (req: Request, res: Response, next: NextFunction)=>{
    const {email, password} = req.body;

    //check if email and password was entered
    if(!email || !password){
        return next(new ErrorResponse("Please provide your email and password", 400));
    }
    try {
        // Check that user exists by email and select it psd
        const user = await User.findOne({email}).select("+password");
        if(!user){
            return next(new ErrorResponse("Invalid credential", 401));
        }

         //Check that password match the email
         const isMatch = await user.isValidPassword(password);
         if(!isMatch){
            return next(new ErrorResponse("Invalid credential", 401));
         }

         sendToken(user, 200, res)

        
    } catch (error) {
        next(error)
        
    }
}

const sendToken = (user:any, statusCode: number, res: any)=>{
    const token = user.getSignedToken();
    res.status(statusCode).json({success: true, token})
}