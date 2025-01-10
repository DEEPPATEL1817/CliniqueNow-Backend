import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import { adminRouter } from './routes/admin.route.js'

//app config

const app = express()
const PORT = process.env.PORT || 8000
connectDB()
connectCloudinary()

//middleware 
app.use(express.json()) 
app.use(cors())

//api endpoint
app.use('/api/admin',adminRouter)
//localhost:8000/api/admin/add-doctor



app.listen(PORT,()=>console.log ("Server started",PORT))
