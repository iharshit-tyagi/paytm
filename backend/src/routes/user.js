import { Router } from "express";
import {z} from "zod";
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


userRouter.post('/signup',validateBodySignup,(req,res)=>{
res.send("User Created")
})

userRouter.post('/signin',validateBodySignin,(req,res)=>{
    res.send("Signed in")
})

export default userRouter;