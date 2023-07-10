import mongoose , { Types, Schema,  model} from "mongoose";

// import  UserDocument  from "./User.js";
interface Url {
    urlId: string;
    originalUrl: string;
    shortUrl: string;
    clicks: number;
    createdAt: Date;
    owner: { type: mongoose.Types.ObjectId, ref: "User" };
    title:string;
    qrCode: string;
    // owner: Document["_id"];
}

const UrlSchema = new Schema<Url>({

    urlId:{
        type: String,
        required: true
    },
    originalUrl:{
        type: String,
        required: true,
    },
    shortUrl:{
        type: String,
        required: true,
    },
    clicks:{
        type: Number,
        required: true,
        default: 0,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    qrCode: String,
    title:String,
    owner:{
        type: mongoose.Types.ObjectId,
        ref: "users"
    }

})

const UrlModel = model<Url>("urls", UrlSchema);
 
export default UrlModel;