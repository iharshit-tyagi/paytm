import { Router } from "express";
import {z} from "zod";
import { User } from "../models/db.js";
import jwt from "jsonwebtoken"
const userRouter=Router();

const zodUserSignup= z.object({
    username:z.string(),
    password:z.string().min(8,{message:'Password should be of min 8 Characters'}),
    firstName: z.string(),
    lastName:z.string()
})

const zodUserSignin= z.object({
    username:z.string(),
    password:z.string().min(8,{message:'Password should be of min 8 Characters'}),
   
})

const generateJWT= async(username)=>{
    const token =await  jwt.sign({username},process.env.JWT_SECRET,{ expiresIn: '120' });
   return token;
}

const validateBodySignup=(req,res,next)=>{
const inputBody= req?.body;
const zodRes=zodUserSignup.safeParse(inputBody);
if(zodRes.success){

next();
}
else{
    res.status(400).json({message:"Invalid username/Password"})
}

}
const validateBodySignin=(req,res,next)=>{
    const inputBody= req?.body;
    const zodRes=zodUserSignin.safeParse(inputBody);
    if(zodRes.success){
    next();
    }
    else{
        res.status(400).json({message:"Invalid username/Password"})
    }
}

const updateDB =async (req,res,next)=>{
const searchUser=await  User.findOne({username:req?.body?.username});
// console.log(searchUser);

    if (searchUser){
    res.status(401).json({
        message: "Email already taken / Incorrect inputs"
    })
        return;
    }
    const newUser= new User({
        firstName : req?.body?.firstName,
        lastName:req?.body?.lastName,
        username:req?.body?.username
    })
    const hashPassword=  await newUser.createHash(req?.body?.password);
    req.token=await generateJWT(req?.body?.username);
    newUser.hashPassword=hashPassword;
    await newUser.save();
    req.userDB= await User.findOne({username:newUser?.username},'username firstName token');
    next();
    
}
userRouter.post('/signup',validateBodySignup,updateDB,(req,res)=>{
res.status(200).json({
	message: "User created successfully",
    user: req?.userDB,
    token:req?.token
})
})

userRouter.post('/signin',validateBodySignin,(req,res)=>{
    res.status(200).json()
})

export default userRouter;