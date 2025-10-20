import { apiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import {User} from "../models/user.models.js"
import { apiResponse } from "../utils/apiResponse.js"


const getUser = asyncHandler(async (req,res) => {
    const user = req.user

    if(!user){
        throw new apiError(400, "user is not logged in")
    }
    res.status(200).json(new apiResponse(200, user, "user fetced successfully"))
})


export {getUser}