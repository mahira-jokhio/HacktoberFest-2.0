import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import jwt from 'jsonwebtoken'
import { User } from "../models/user.models.js";

export const isAuthenticated = asyncHandler(async (req,res,next) => {
    try {
        const {token} = req.cookies
    
        if(!token){
            throw new apiError(400, "User is not Logged in")
        }
    
        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
        console.log(decoded)
        
    
        req.user = await User.findById(decoded.id)
        console.log(req.user)
    
        next()
    } catch (error) {
        throw new apiError(400, "User is not Logged in")
        res.clearCookie('token')
        next()
    }
})
