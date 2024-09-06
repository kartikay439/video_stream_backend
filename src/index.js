// require('dotenv').config()

import dotenv from 'dotenv'
import {app} from './app.js'

import express from 'express'
import connectDB from "./db/index.js";
dotenv.config({
    path:'./env'
})
connectDB()
.then(()=>{
    app.listen(process.env.port || 8000,()=>{
console/log(`Server is running at ${process.env,PORT}`);
    })
    app.on("error",(error)=>{
console.log("Error ",error)
    })
}).catch((error)=>{
    console.log("connection failed to Mongo DB");
})





















/*

const app=express()


;(async () => {
try{
await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
app.on("error",(error)=>{
console.log("Error : ",error)
throw error
})

app.listen(process.env.PORT,()=>{
    console.log(`Server is runnning on the PORT : ${process.env.PORT}`)
})
}catch(error){
    console.error("Error  : ",error)
    throw err
}


})()*/