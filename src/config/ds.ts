
import dotenv from 'dotenv';
dotenv.config();
import mongoose , { ConnectOptions } from "mongoose";


// console.log(process.env.MONGO_URI)
const connectDB = async (): Promise<void>=>{
 try {
    const mongoURI = process.env.MONGO_URI;

    if(!mongoURI){
        throw new Error('MONGO_URI is not defined');
    }
    await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions);
      console.log('Database Connected');


 } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    
 }
}

export default connectDB;