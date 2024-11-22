import { Router } from "express";
import userRouter from "./user.js";
import accountRoute from "./account.js";
const route=Router();
route.use('/user',userRouter);
route.use('/account',accountRoute);



export default route;