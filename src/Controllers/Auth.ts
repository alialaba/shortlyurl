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

const sendToken = (user:any, statusCode: number, res: any)=>{
    const token = user.getSignedToken();
    res.status(statusCode).json({success: true, token})
}