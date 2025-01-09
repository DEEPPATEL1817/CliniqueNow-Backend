import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'

//app config

const app = express()
const PORT = process.env.PORT || 7000
connectDB()
connectCloudinary()

//middleware 
app.use(express.json()) 
app.use(cors())

//api endpoint
app.get('/',(req,res)=>{
    res.send('api working ')
})

app.listen(PORT,()=>console.log ("Server started",PORT))
