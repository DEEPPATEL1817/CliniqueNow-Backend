// API for adding new doctor 

import validator from 'validator'
import bcrypt from "bcrypt"
import { v2 as cloudinary} from 'cloudinary'
import { Doctor } from '../models/doctor.model.js'
import { uploadOnCloudinary } from '../config/cloudinary.js'
import { upload } from '../middlewares/multer.js'
import jwt from 'jsonwebtoken'
import { UserAppointment } from '../models/appointment.model.js'
import { User } from '../models/user.model.js'



const addDoctor = async (req,res) => {
    try {
        // console.log("hello ji")
        const {name,email,password,speciality,degree,experience,about,fees,address}=req.body

       
        // console.log("name &  email",name,email)

        if([name,email,password,speciality,degree,experience,about,fees,address].some((field) => {return typeof field === "string" && field?.trim()==="" }))
        {
            return res.status(400).json({ message: "All fields are required" });

        }

        // console.log(" all requirements:",name,email,password,speciality,degree,experience,about,fees,address)

        //validating email 
        if(!validator.isEmail(email)){
            return res.status(401).json({message:"Please enter a valid Email ID"})
        }

        const existingDoctor = await Doctor.findOne({email})
        console.log(existingDoctor)

        if(existingDoctor){
            return res.status(400).json({ message: "Doctor already exists" });
        }
        // console.log("doctor is already exist",existingDoctor)

        // validating the password 
        if(password.length <= 8){
            return res.status(401).json({message:"Please enter a strong password"})
        }

        //hashing the password 
        const hashPassword = await bcrypt.hash(password,10)

        const imageFile = req.file;
        // console.log("uploaded file",imageFile )

        // if(!imageFile ){
        //     return res.status(401).json({message:"Image file is not uploaded"})
        // }
        // else{
        //     return res.status(200).json({message:"image is uploaded successfully",file:imageFile})
        // }

        //uploading image to cloudinary 
        const imageUpload = await uploadOnCloudinary(imageFile.path)
        
        console.log(imageUpload)
        const immageUrl = imageUpload.url

        const newDoctorData = await Doctor.create({
            name,
            email,
            image:immageUrl,
            password:hashPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address,
            date: Date.now(),
        })
        

        const newDoctorCreated=await Doctor.findById(newDoctorData._id).select(
            "-password"
        )
        console.log(newDoctorCreated)
        
        if(!newDoctorCreated){
           return res.status(500).json({message:"Something went wrong while registering user"});
            
        }
    
        // returning response from db to user
        return res.status(201).json({
            newDoctorCreated,
            message: "Doctor is successfully added"
        });
        
    } catch (error) {
        console.log(400,"Registeration of new Doctor is Failed",error)
    }
}

const adminLogin = async (req,res) => {
    try {
        const {email, password}=req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD)
            {
            
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            
            res.status(200).json({message:"JWT token is successfully created",token})
        }
        else{
            res.status(400).json({message:"Invalid credentials"})
        }

        
    } catch (error) {
        console.log(400,"Registeration of new Doctor is Failed",error)
    }
}

//to get all doctor list for admin panel

const allDoctor = async (req,res) => {
    try {
        const doctors = await Doctor.find({}).select('-password')
        console.log("list of doctors",doctors)
        res.status(200).json({doctors,message:"Fetched All Doctor"})
    } catch (error) {
        console.log(error)
        res.status(400).json({message:"Something went wrong to fetch all doctors"})
    }
}


//api to get all appoinment list 
const appointmentAdmin = async ( req, res ) => {
    try {
        const appointments = await UserAppointment.find({})

        res.status(200).json({message:"Here is all Appointment",appointments})
    } catch (error) {
        console.log(error)
        res.status(400).json({message:"Something went wrong to fetch all appointment"})
    }

}

//api for appointment cancellation
const appointmentCancel = async (req , res ) => {

    try {
        // console.log("cancellll:",userId,appointmentId)
        const {appointmentId} = req.body

        console.log("ddddddddddd:",appointmentId)

        const appoinmentData = await UserAppointment.findById(appointmentId)
        console.log( "Appointment data is required." ,appoinmentData);


        await UserAppointment.findByIdAndUpdate(appointmentId,{cancelled:true})

        //after cancelling the appointment then time slot should be free

        const {docId,slotDate,slotTime} = appoinmentData

        const doctorData = await Doctor.findById(docId)

        const slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter( e => e !== slotTime)

        await Doctor.findByIdAndUpdate(docId,{slots_booked})

        res.status(200).json({message:"Appointment Canncelled"})
    } catch (error) {
        console.error("Error fetching user data:", error);
        return res.status(500).json({ message: "Server error: In Cancelling Appointments.Please try again later." });
    }
}

//api to get dashboard Data for admin panel
const adminDashBoard = async ( req, res) => {
    try {

        const doctors = await Doctor.find({})
        const users = await User.find({})
        const appointment = await UserAppointment.find({})

        const dashData = {
            doctors: doctors.length,
            appointments : appointment.length,
            patients : users.length,
            latestAppointments : appointment.reverse().slice(0,5)
        }
        res.status(200).json({message:"Dash Board Data :",dashData})
    } catch (error) {
        console.error("Error fetching user data:", error);
        return res.status(500).json({ message: "Server error: In fetching Data in the DashBoard .Please try again later." });
    }
}

export {
    addDoctor,
    adminLogin, 
    allDoctor,
    appointmentAdmin,
    appointmentCancel,
    adminDashBoard

}