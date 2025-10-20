import { User } from "../models/user.models.js"
import { apiError } from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { sendResWithToken } from "../utils/sendResWithToken.js"

const register = asyncHandler(async (req,res) => {
    let {name, email, password, role} = req.body

    if(!name || !email || !password){
        throw new apiError(400, "All fields are required!")
    }
    if(!role){
        role = "user"
    }

    //check if the user already exists
    const existedUser = await User.findOne({email})
    if(existedUser){
        throw new apiError(409, "User with email or username already exists" )
    }


    const user = await User.create({
        name,
        email,
        password,
        approved: true,
        role
    })

    user.save()




    sendResWithToken(user,201,"User registered successfully!", res)
    
})

const login = asyncHandler(async (req,res) => {
    let { email, password} = req.body

    if(!email || !password){
        throw new apiError(400, "All fields are required!")
    }

    //check
    const user = await User.findOne({email}).select("+password");
    if(!user){
        throw new apiError(404, "User not found")
    }

    //validate pass
    const isPassCorrect = await user.isPasswordCorrect(password)
    if(!isPassCorrect){
        throw new apiError(403, "Invalide Password")
    }



    sendResWithToken(user,201,"User logged in!", res)
})


const logout = asyncHandler(async (req,res) => {
    
    res.status(200).cookie("token", "",{
        expires: new Date(Date.now()),
        httpOnly: true,  
    }).json(new apiResponse(200, {}, "logged out successfully"))
})

export {register, login, logout}