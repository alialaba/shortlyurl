import dotenv from 'dotenv';
dotenv.config({ path: '../config/.env' });
import { Request, Response, NextFunction } from 'express';
import Url from "../Models/Url";
import User from "../Models/User";
import { nanoid } from 'nanoid';
import { validateUrl } from '../Utils/validateUrl';
import QRCode from "qrcode";
import fs from "fs";

import ErrorResponse from '../Utils/errorResponse';




export const shortenUrl = async(req: Request, res: Response, next: NextFunction)=>{

    const {originalUrl} = req.body;
    const BASE = process.env.BASE;

    const urlId: string = nanoid(5);
    
    if(validateUrl(originalUrl)){
        try {

            let url = await Url.findOne({originalUrl});
            if(url){
                res.status(201).json({success:true, url})
            }else{
                if (!req.user) {
                    return next(new ErrorResponse('User not authenticated', 401));
                  }
                  
                  let user = await User.findById(req.user._id);
                if (!user) {
                    return next(new ErrorResponse('User not found', 404));
                  }
                const shortUrl = `${BASE}/${urlId}`;

                let newShortenUrl = await Url.create({
                    originalUrl,
                    shortUrl,
                    urlId,
                    createdAt: new Date(),
                   owner: user._id
                })
                // console.log("new datas", newShortenUrl)
    
              let savedUrl =  await newShortenUrl.save();
              //save shortenurl to the owner 
              user.urls= user.urls.concat(savedUrl.shortUrl)
              await user.save()

              // Generate QR code
              const qrCode = await QRCode.toDataURL(shortUrl);

              res.status(201).json({success:true, newShortenUrl, qrCode});

              

            }
        
        } catch (error) {
            next(error)
        }
    }else{
        return next(new ErrorResponse('Invalid Original Url', 400))
    }
}



//Redirect the Url
export const redirectUrl = async (req: Request,res: Response, next: NextFunction)=>{

    try {
        const url = await Url.findOne({urlId: req.params.urlId});

        if(url){
            await Url.updateOne({urlId:req.params.urlId}, {$inc: {clicks: 1}});
            // return res.redirect((await url).originalUrl);


        let user = await User.findById(req.user._id)
             // Check if the owner of the URL matches the authenticated user
        if (user && user.urls.includes(url.shortUrl)){
             return res.redirect(url.originalUrl);
         } else {
        // If the user is not the owner, return an error or handle it accordingly
            return next(new ErrorResponse("Unauthorized User", 401));
        }
        }else{
            // res.status(404).json("Not Found")
            return next(new ErrorResponse("Not Found", 404));
        }
        
    } catch (error) {
        // console.log(error);
        // res.status(500).json('Server Error');
        next(error)
    }

}

export const deleteUrl = async(req:Request, res:Response, next: NextFunction)=>{
    try {

        const url = await Url.findOneAndDelete({urlId: req.params.urlId});
        if(!url){
            return next(new ErrorResponse("Not found", 404))
        }
        // Delete QR code image file if it exists
        const qrCodePath = `path/to/qrCodes/${req.params.urlId}.png`;
        if (fs.existsSync(qrCodePath)) {
            fs.unlinkSync(qrCodePath);
        }
        res.status(200).json({ success: true, message: 'URL deleted successfully' });

    } catch (error) {
        next(error)
    }
}


