import {Router} from 'express'
import authMiddleware from '../middlewares/authMiddleware.js';
import { User ,Account} from '../models/db.js';
import mongoose from 'mongoose';
const accountRoute= Router();

const getBalanceFromDB=async(req,res,next)=>{

const user = await User.findOne({username:req?.userID});


if(user){
    const account= await Account.findOne({userID:user?._id});
    // console.log(account);
    req.balance=account?.balance;
    next();
}
else{
    res.status(404).json({
        message:'User does not exist'
    })
}
}
const findToAccount=async(req,res,next)=>{
    const toUser = await User.findOne({username:req?.body?.to});
    if(!toUser){
        res.status(400).json({
            message: "Invalid account"
        })
    }
req.toUser=toUser;
const fromUser = await User.findOne({username:req?.userID});
req.fromUser=fromUser
next();
}
const doTransaction=async(req,res,next)=>{
    const session = await mongoose.startSession();
session.startTransaction();
    const fromAccount= await Account.findOne({userID:req?.fromUser?._id}).session(session);
    const toAccount= await Account.findOne({userID:req?.toUser?._id}).session(session);
   
    if (fromAccount?.balance<req?.body?.amount){
        await  session.abortTransaction();
      return  res.status(400).json({
            message:'Insufficient Balance'
        })
    }

  
     await    Account.updateOne({userID:fromAccount?.userID},{'$inc':{balance:-req?.body?.amount}}).session(session);
   await      Account.updateOne({userID:toAccount?.userID},{'$inc':{balance:req?.body?.amount}}).session(session);
//    await fromAccount.updateOne({balance:(fromBalance-req?.body?.amount)})
//     await fromAccount.updateOne({balance:(toBalance+req?.body?.amount)})
     session.commitTransaction();
   
 
     
    next();
}
accountRoute.get('/balance',authMiddleware,getBalanceFromDB,(req,res)=>{
    res.status(200).json({
        balance: req?.balance
    })
})

accountRoute.post('/transfer',authMiddleware,findToAccount,doTransaction,(req,res)=>{
    res.status(200).json({
        message: "Transfer successful"
    })
})
export default accountRoute; 