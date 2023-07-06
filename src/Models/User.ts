import dotenv from 'dotenv';
dotenv.config()

import mongoose , {model, Schema} from "mongoose";



interface User {
    fullname: string;
    email: string;
    password: string;
    urls:string[];
    isValidPassword(password: string): Promise<boolean>;
    
}


const UserSchema = new Schema<User>({

    fullname:{
        type: String,
        required: true
    },

    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        // minlength: 6,
    },
    urls:[
        {
            type: String,
            ref:"urls"
        }
    ]

})

