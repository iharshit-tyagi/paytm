import mongoose from "mongoose";


export  const connectDB = async()=>{
    mongoose.connect(process.env.DB_CONNECTURL);
    console.log('DB COnnec');
    
}

const userSchema= new mongoose.Schema({
    username: {
        required: true,
        unique: true,
        type: String
    },
    password:{
        required: true,
        type: String
    },
    firstName: {
        required: true,
        type: String
    },
    lastName: String
});
export const User= mongoose.model('User',userSchema)