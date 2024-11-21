import jwt from 'jsonwebtoken'
const authMiddleware=(req,res,next)=>{

//Check auth details
const authHeader = req?.headers['authorization'];
if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({});
}

const token = authHeader.split(' ')[1];
jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
    if(err){
        res.status(401).json({
            message:err
        })
      return;
    }else{
        req.username=decoded?.username;
        next();
    }
    
})
}
export default authMiddleware;