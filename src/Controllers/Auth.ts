import User from "../Models/User";
import ErrorResponse from "../Utils/errorResponse";


export const signup = async (req, res, next)=>{
    const {fullname, email, password} = req.Body;

    try {
        const user = await User.create({fullname, email, password})

        sendToken(user, 201, res)
        
    } catch (error) {
        next(error)
    }

}

const sendToken = (user, statusCode, res)=>{
    const token = user.getSignedToken();
    res.status(statusCode).json({success: true, token})
}