// API for adding new doctor 

import validator from 'validator'
import bcrypt from "bcrypt"
import { v2 as cloudinary} from 'cloudinary'
import { Doctor } from '../models/doctor.model.js'
import { uploadOnCloudinary } from '../config/cloudinary.js'


const addDoctor = async (req,res) => {
    try {
        const {name,email,password,speciality,degree,experience,about,fees,address}=req.body

       
        // console.log("name &  email",name,email)

        if([name,email,password,speciality,degree,experience,about,fees,address].some((field) => {return field?.trim()==="" }))
        {
            return res.status(400).json({ message: "All fields are required" });

        }

        console.log(" all requirements:",name,email,password,speciality,degree,experience,about,fees,address)

        const existingDoctor = await Doctor.findOne({email})

        if(existingDoctor){
            return res.status(400).json({ message: "Doctor already exists" });
        }
        console.log("doctor is already exist",existingDoctor)


      
        
    } catch (error) {
        console.log(400,"Registeration of new Doctor is Failed",error)
    }
}

export {addDoctor}