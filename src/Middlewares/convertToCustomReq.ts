import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
  user: any; // Assuming User is the type for your user object
}

const convertToCustomRequest = (req: Request, res: Response, next: NextFunction) => {
  // Assuming you have the user information available in the request (e.g., after authentication)
  // You can modify this code to obtain the user details in your specific setup
  const user = req.user; // Assuming user information is available in req.user

  // Create a new CustomRequest object by extending the Request object and adding the user property
  const customReq: CustomRequest = Object.create(req);
  customReq.user = user;

  // Replace the original req object with the customReq object
  req = customReq;

  next();
};

export default convertToCustomRequest;
