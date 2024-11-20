import mongoose from "mongoose";

import bcrypt from "bcrypt"
export  const connectDB = async()=>{
    mongoose.connect(process.env.DB_CONNECTURL);  
}

const UserSchema= new mongoose.Schema({
    username: {
        required: true,
        unique: true,
        type: String
    },
    hashPassword:{
        required: true,
        type: String
    },
    firstName: {
        required: true,
        type: String
    },
    lastName: String
});
UserSchema.methods.createHash=async (plainTextPassword)=>{
    // Hashing user's salt and password with 10 iterations,
    const saltRounds = 10;
    
    // First method to generate a salt and then create hash
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(plainTextPassword, salt);
    }

// Validating the candidate password with stored hash and hash function
UserSchema.methods.validatePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password_hash);
  };
export const User= mongoose.model('User',UserSchema)