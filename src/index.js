// require('dotenv').config()

import dotenv from 'dotenv'

import express from 'express'
import connectDB from "./db/index.js";
dotenv.config({
    path:'./env'
})
connectDB()





















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