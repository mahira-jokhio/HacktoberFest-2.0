import { apiResponse } from "./apiResponse.js"

 const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'prod', // Set to true in production, false in development
            sameSite: process.env.NODE_ENV === 'prod' ? 'None' : 'Lax', // Use 'None' in production, 'Lax' in development
        };

export const sendResWithToken = async (user, statusCode, message, res)=>{
    const token =  await user.generateToken()
    res.status(statusCode)
    .cookie('token', token, options)
    .json(new apiResponse(statusCode, {user}, message))
}