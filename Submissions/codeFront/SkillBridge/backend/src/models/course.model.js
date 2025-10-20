import mongoose, {Schema} from "mongoose";

const courseSchema = Schema({
    name:{
        type: String,
        required: true,
    },
    students:[ {
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
    description:{
        type: String,
        required:true,
    },
    teacher:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    approved: {
        type: Boolean,
        default: false
    },
    video:[{
        type: String
    }]
}, {timestamps:true})






export const Course = mongoose.model("Course", courseSchema)