import mongoose, {Schema} from "mongoose";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

const userSchema = Schema({
    name:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
        select: false
    },
    role:{
        type: String,
        enum: ["student", "teacher", "admin"]
    },
    approved: {
        type: Boolean,
        default: false
    }
}, {timestamps:true})


userSchema.pre('save', async function (next) {
    if(!this.isModified("password")){
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password,this.password)
}

// userSchema.methods.generateAccessToken = async function () {
//     //short lived  access token
//     return jwt.sign({
//         _id : this._id,
//         email: this.email,
//         username: this.username,
//         fullname: this.fullname
//     }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRY})
// }

userSchema.methods.generateToken = function () {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};



export const User = mongoose.model("User", userSchema)