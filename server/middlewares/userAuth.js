import jwt from "jsonwebtoken"

const userAuth = async(req,res,next)=>{
    const {token}=req.cookies;
    if(!token)return res.json({success:false,message:"User not Authorized Login Again"});
    const tokenDecode = jwt.verify(token,process.env.JWT_SECRET);
    try {
        if (tokenDecode.id) {
            req.userId = tokenDecode.id
        }else{
            return res.json({success:false,message:"User not Authorized Login Again"});
        }
        next();
    } catch (error) {
        return res.json({success:false,message:error.message })
    }
}
export default userAuth;