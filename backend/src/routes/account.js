import {Router} from 'express'
import authMiddleware from '../middlewares/authMiddleware.js';
import { User ,Account} from '../models/db.js';

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
    const fromAccount= await Account.findOne({userID:req?.fromUser?._id});
    const toAccount= await Account.findOne({userID:req?.toUser?._id});
    const fromBalance= fromAccount?.balance;
    const toBalance= toAccount?.balance;
    if (fromAccount?.balance<req?.body?.amount){
        res.status(400).json({
            message:'Insufficient Balance'
        })
        return;
    }

    try{
     await    Account.updateOne({userID:fromAccount?.userID},{balance:(fromBalance-req?.body?.amount)})
   await      Account.updateOne({userID:toAccount?.userID},{balance:(toBalance+req?.body?.amount)})
//    await fromAccount.updateOne({balance:(fromBalance-req?.body?.amount)})
//     await fromAccount.updateOne({balance:(toBalance+req?.body?.amount)})
      next();
    }catch(err){
        await fromAccount.updateOne({balance:fromBalance})
        await fromAccount.updateOne({balance:toBalance})
        res.status(401).json({
            message:'Transaction Failed!'
        })
        return;
    }
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