import express from 'express'
import cors from "cors"
import cookieParser from 'cookie-parser'
import { errorHandler } from './middlewares/error.middleware.js'
import dotenv from 'dotenv'
dotenv.config()

//import routes
import healthcheckRouter from './routes/healthcheck.routes.js'
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.routes.js"
import courseRouter from "./routes/course.routes.js"


const app = express()
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    })
)
app.use(cookieParser())

//common middleware
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended:true, limit: "16kb"}))
app.use(express.static("public"))


//routes
app.use("/api/healthcheck", healthcheckRouter)
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/course", courseRouter)

app.use(errorHandler)

export {app} 