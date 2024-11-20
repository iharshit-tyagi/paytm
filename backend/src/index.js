import express from "express"
import 'dotenv/config'
import { connectDB } from "./models/db.js";
import route from "./routes/index.js";
import cors from 'cors'
const app = express();
connectDB();
app.use(cors());
app.use(express.json());
app.use('/api/v1',route);
app.listen(process.env.PORT||4000,()=>{
    console.log('App is listening on PORT '); 
    
})