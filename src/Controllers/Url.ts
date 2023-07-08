import dotenv from 'dotenv';
dotenv.config({ path: '../config/.env' });
import { Request, Response, NextFunction } from 'express';
import Url from "../Models/Url";
import User from "../Models/User";
import { nanoid } from 'nanoid';
import { validateUrl } from '../Utils/validateUrl';

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

              res.status(201).json({success:true, newShortenUrl})

            }
        
        } catch (error) {
            next(error)
        }
    }else{
        return next(new ErrorResponse('Invalid Original Url', 400))
    }



}