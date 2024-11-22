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
accountRoute.get('/balance',authMiddleware,getBalanceFromDB,(req,res)=>{
    res.status(200).json({
        balance: req?.balance
    })
})
export default accountRoute;