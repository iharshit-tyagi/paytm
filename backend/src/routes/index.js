import { Router } from "express";
import userRouter from "./user.js";
const route=Router();
route.use('/user',userRouter);



export default route;