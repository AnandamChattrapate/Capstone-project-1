import express from 'express'
import { connect } from 'mongoose'
import { authorRoute } from './APIs/AuthorApi.js'
import { userRoute } from './APIs/UserApi.js'
import { adminRoute } from './APIs/AdminApi.js'
import cookieParser from 'cookie-parser'
import { commonRouter } from './APIs/CommonApi.js'

import {config} from 'dotenv'
config() 
// process.env => 
// to access env variable we need to call config()

const app=express()
app.use(express.json())
app.use(cookieParser())
app.use('/user-api',userRoute);
app.use('/author-api',authorRoute);
app.use('/admin-api',adminRoute);
app.use('/common-api',commonRouter)

 // connect to DB
 const connectDB=async()=>{
    try{
        
        await connect(process.env.DB_URL)
        console.log("DB connection success ")
        app.listen(process.env.PORT,()=>console.log("server started at PORT",process.env.PORT))

    }catch(err){
        console.log(err.message)
    }


 }
connectDB();

// to Handle Invalid Routes
app.use((req,res,next)=>{
    //console.log(req)
    res.json({message:`${req.url} is Invalid Path`})
})
 // error handling middleware
 app.use((err,req,res,next)=>{
    //console.log(err.message)
    res.json({message:err.message})
 })