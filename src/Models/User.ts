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



// The code in the UserScheme.pre() function is called a pre-hook.
// Before the user information is saved in the database, this function will be called,
// you will get the plain text password, hash it, and store it.

UserSchema.pre("save", async function(next) {
    if(!this.isModified("password")){
        next()
    }

    const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    
})


// You will also need to make sure that the user trying to log in has the correct credentials. Add the following new method:
UserSchema.methods.isValidPassword = async function(password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
  
    return compare;
  }


//you will need token to get signed in.
UserSchema.methods.getSignedToken = function(){
//jwt: accept payload && secretOrprivatekey && options
 return jwt.sign({id: this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE})
}

const UserModel = model<User>("users", UserSchema);
export  default UserModel;